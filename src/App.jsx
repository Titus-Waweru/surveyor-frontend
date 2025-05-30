import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AppRouter from "./AppRouter.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        // Validate token (optional)
        jwtDecode(token); // You can verify it's valid without resetting anything

        // Restore full user from storage
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.warn("Invalid token, clearing session.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  return <AppRouter user={user} setUser={setUser} />;
}
