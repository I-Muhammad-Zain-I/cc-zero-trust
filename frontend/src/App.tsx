import "./App.css";
import { useAuth } from "react-oidc-context";

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (auth.error) {
    return <div>Oops! {auth.error.message}</div>;
  }

  const apiTestHandler = async () => {
    console.log({ access_token: auth.user && auth?.user.access_token });
    if (!auth.user) return;
    const response = await fetch("http://localhost:10000/api", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth?.user.access_token}`,
        // "Access-Control-Allow-Origin": "http://localhost:5173",
        // "Access-Control-Allow-Credentials": "true",
      },
    });
    if (!response.ok) {
      console.log("REQUEST FAILED");
      console.log(response);
      return;
    }
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      {auth.isAuthenticated ? (
        <div>
          <p>Authenticated!</p>
          <button onClick={() => auth.signoutRedirect()}>Logout</button>
        </div>
      ) : (
        <button onClick={() => auth.signinRedirect()}>Login</button>
      )}
      {<button onClick={() => apiTestHandler()}>Test Hit</button>}
    </div>
  );
}

export default App;
