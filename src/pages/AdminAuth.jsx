// src/pages/AdminAuth.jsx
import { useState } from "react";
import axios from "axios";

export default function AdminAuth({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (res.data.role !== "admin") {
        return setError("Access denied. Not an admin.");
      }

      // Save user info to state
      setUser({ email: res.data.email, role: res.data.role });
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-700">Admin Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <label className="block">
          Email
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
          />
        </label>

        <label className="block">
          Password
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
