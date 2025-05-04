import "./App.css";
import { useAuth } from "react-oidc-context";
import { useState } from "react";

const roleMap = {
  finance_user: "Finance User",
  finance_officer: "Finance Officer",
  finance_manager: "Finance Manager",
  compliance_officer: "Compliance Officer",
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getUserRole(allRoles) {
  return allRoles.filter(
    (r: string) => r.startsWith("finance_") || r.startsWith("compliance_")
  );
}

function App() {
  const auth = useAuth();

  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [status, setStatus] = useState("");

  const getGeoPosition = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );

  const apiTestHandler = async () => {
    setStatus("Preparing request...");
    await sleep(500);
    if (!auth.user) return;

    const userId = auth.user.profile?.sub as string;

    const allRoles = auth.user.profile?.realm_access?.roles || [];
    const financeRoles = getUserRole(allRoles);
    const role = financeRoles.length > 0 ? financeRoles[0] : "finance_user";

    let geo = { latitude: "", longitude: "" };
    try {
      const pos = await getGeoPosition();
      geo = {
        latitude: pos.coords.latitude.toString(),
        longitude: pos.coords.longitude.toString(),
      };
    } catch (err) {
      console.warn("Geolocation denied or failed:", err);
    }

    const device = {
      os: navigator.platform,
      browser: navigator.userAgent,
    };

    const timestamp = new Date().toISOString();

    const payload = {
      user: {
        userId,
        role,
      },
      context: {
        geo,
        device,
        time: timestamp,
      },
      transaction: {
        amount: parseFloat(amount),
        currency,
      },
    };

    console.log("Sending payload:", payload);
    await sleep(500);
    setStatus("Sending request...");

    try {
      const response = await fetch("http://localhost:10000/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.text();
        setStatus(`Request failed: ${response.status} ${err}`);
        return;
      }

      const data = await response.json();
      await sleep(500);
      console.log("API response:", data);
      setStatus("Access Granted: " + JSON.stringify(data));
    } catch (error) {
      console.error("Request error:", error);
      setStatus("❌ Error occurred while sending request");
    }
  };

  if (auth.isLoading)
    return <div className="container">Loading authentication...</div>;
  if (auth.error)
    return <div className="container">Oops! {auth.error.message}</div>;

  const role =
    auth.isAuthenticated &&
    getUserRole(auth?.user.profile?.realm_access?.roles || [])[0];
  const userRole = roleMap?.[role];

  return (
    <div className="container">
      <h1>Transaction Access Control</h1>
      {auth.isAuthenticated ? (
        <>
          <h2>
            Welcome, {auth?.user.profile.given_name}{" "}
            {auth?.user.profile.family_name}
          </h2>
          <h3>{userRole}</h3>
          <div className="form-group">
            <label>Transaction Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          <div className="form-group">
            <label>Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="PKR">PKR</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div className="buttons">
            <button onClick={apiTestHandler}>Send Transaction</button>
            <button className="logout" onClick={() => auth.signoutRedirect()}>
              Logout
            </button>
          </div>
          {status && <div className="status">{status}</div>}
        </>
      ) : (
        <button onClick={() => auth.signinRedirect()}>Login</button>
      )}
    </div>
  );
}

export default App;
