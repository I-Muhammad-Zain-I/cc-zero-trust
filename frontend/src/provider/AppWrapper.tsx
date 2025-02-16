import { useAuth } from "react-oidc-context";
import App from "../App";

const AppWrapper = () => {
  // const { isAuthenticated } = useAuth();

  return <App isAuthenticated={true} />;
};

export default AppWrapper;
