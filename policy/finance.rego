package envoy.authz

default allow = false

allow if {
    print("ENTERED POLICY")

    parsed_body := input.parsed_body
    user := parsed_body.user
    role := user.role
    user_id := user.userId
    txn := parsed_body.transaction
    ctx := parsed_body.context

    # Fetch risk context
    url := sprintf("http://host.docker.internal:4000/context/%s", [user_id])
    resp := http.send({
        "method": "GET",
        "url": url,
        "headers": {"Content-Type": "application/json"},
        "timeout": "5s"
    })

    not resp.error
    resp.status_code == 200
    context_data := resp.body

    risk_score := context_data.risk_score
    avg_txn := context_data.avg_txn_24h
    failed_logins := context_data.failed_logins

    # Decision logic
    print("Evaluating role: ", role)

   allowed_role_decision(role, txn.amount, risk_score, ctx.geo)
}

allowed_role_decision("finance_user", amount, risk_score, _) if {
    allow_finance_user(amount, risk_score)
}

allowed_role_decision("finance_officer", amount, risk_score, _) if {
    allow_finance_officer(amount, risk_score)
}

allowed_role_decision("finance_manager", amount, risk_score, _) if {
    allow_finance_manager(amount, risk_score)
}

allowed_role_decision("compliance_officer", amount, risk_score, geo) if {
    allow_compliance_officer(amount, risk_score, geo)
}



# Finance User: Low threshold and low risk
allow_finance_user(amount, risk_score) if {
    amount <= 1000
    risk_score < 30
}

# Officer can approve up to 10k if risk is acceptable
allow_finance_officer(amount, risk_score) if {
    amount <= 10000
    risk_score < 50
}

# Manager can approve up to 100k even with high risk
allow_finance_manager(amount, _) if {
    amount <= 100000
}

# Compliance logic: Only allow within 50k and no high-risk countries
allow_compliance_officer(amount, risk_score, geo) if {
    amount <= 50000
    not is_high_risk_geo(geo)
    risk_score < 70
}

# High-risk geolocations (example: Russia, China)
is_high_risk_geo(geo) if {
    lat := to_number(geo.latitude)
    lon := to_number(geo.longitude)

    # Russia
    lat > 41.1851
    lat < 81.8574
    lon > 19.6389
    lon < 190.0000
}


