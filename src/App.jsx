import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ Correct named import
import AppRouter from "./AppRouter.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        // Decode token to check expiration
        jwtDecode(token);

        // Parse user from localStorage
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.warn("Invalid token or user data. Clearing localStorage.");
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
