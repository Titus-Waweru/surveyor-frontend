import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import AppRouter from "./AppRouter.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const decoded = jwtDecode(token);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          throw new Error("Token expired");
        }

        const parsedUser = JSON.parse(storedUser);
        parsedUser.role = parsedUser.role.toLowerCase(); // ensure role consistency

        setUser(parsedUser);
      } catch (err) {
        console.warn("Invalid or expired token. Logging out.");
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
