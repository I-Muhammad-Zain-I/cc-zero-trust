import { UserManager } from "oidc-client-ts";

export const userManager = new UserManager({
  authority: "http://localhost:8080/realms/zero-trust",
  client_id: "vite-frontend",
  redirect_uri: `${window.location.origin}${window.location.pathname}`,
  response_type: "code",
  post_logout_redirect_uri: window.location.origin,
  // userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  // monitorSession: true
});

export const onSigninCallback = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

// const userManager = new UserManager(authConfig);

// export default userManager;

// import Keycloak from "keycloak-js";

// const keycloak = new Keycloak({
//   realm: "zero-trust", // Your Keycloak realm name
//   clientId: "vite-frontend", // Your Keycloak client ID
//   url: "http://localhost:8080", // Your Keycloak server URL
// });

// export default keycloak;
