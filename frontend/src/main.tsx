import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppWrapper from "./provider/AppWrapper";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import { onSigninCallback, userManager } from "./config/IdentityProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider userManager={userManager} onSigninCallback={onSigninCallback}>
      <App />
    </AuthProvider>
  </StrictMode>
);
