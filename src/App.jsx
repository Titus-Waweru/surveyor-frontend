import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import AppRouter from "./AppRouter.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("App.jsx useEffect: Checking localStorage for token and user...");

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded JWT token:", decoded);

        if (decoded.exp * 1000 < Date.now()) {
          console.warn("Token expired");
          throw new Error("Token expired");
        }

        const parsedUser = JSON.parse(storedUser);
        parsedUser.role = parsedUser.role.toLowerCase();

        console.log("Parsed user from localStorage:", parsedUser);

        setUser(parsedUser);
      } catch (err) {
        console.warn("Invalid or expired token. Logging out.", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    } else {
      console.log("No valid token or user found in localStorage.");
    }

    setLoading(false);
  }, []);

  // << Add this function >>
  const onLogin = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  // << Add this function >>
  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600 text-lg">
        Loading...
      </div>
    );
  }

  // Pass onLogin and onLogout to AppRouter
  return (
    <AppRouter 
      user={user} 
      setUser={setUser} 
      onLogin={onLogin} 
      onLogout={onLogout} 
    />
  );
}
