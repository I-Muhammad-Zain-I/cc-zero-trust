FROM quay.io/keycloak/keycloak:22.0.5

# Set the Keycloak mode to development
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]
