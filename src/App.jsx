// App.jsx
import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode"; // default import
import AppRouter from "./AppRouter.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        jwtDecode(token); // just to verify it's a valid token format
        setUser(JSON.parse(storedUser));
      } catch (err) {
        // If invalid token/user data, clear storage and reset user
        console.warn("Invalid token or user data. Logging out.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600 text-lg">
        Loading...
      </div>
    );
  }

  return <AppRouter user={user} setUser={setUser} />;
}
