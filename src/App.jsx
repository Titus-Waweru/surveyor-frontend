import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ Fixed import
import AppRouter from "./AppRouter.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ email: decoded.email, role: decoded.role });
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  return <AppRouter user={user} setUser={setUser} />;
}
