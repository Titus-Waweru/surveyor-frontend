import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import logo from "../assets/logo.png"; // <-- import the logo

const API = import.meta.env.VITE_API_URL;

export default function AdminLogin({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${API}/auth/login`, {
        email: email.trim(),
        password: password.trim(),
      });

      if (res.data.role !== "admin") {
        setError("Access denied. Admins only.");
        setIsSubmitting(false);
        return;
      }

      setUser({ email: res.data.email, role: res.data.role });
      navigate("/admin");
    } catch {
      setError("Login failed. Please check your credentials.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fff6e5] flex flex-col items-center justify-center px-4 py-10">
      <section
        className="w-full max-w-6xl bg-white shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
        data-aos="fade-up"
      >
        {/* Left Panel */}
        <div className="bg-yellow-500 text-white p-10 md:p-12 flex flex-col items-center justify-center">
          {/* Wrapped logo in white rounded container */}
          <div className="bg-white p-3 rounded-full mb-6">
            <img
              src={logo}
              alt="LandLink Logo"
              className="h-[100px] w-auto max-w-[220px] object-contain"
            />
          </div>

          <h1 className="text-3xl font-bold mb-2 font-poppins text-center">
            LandLink Admins
          </h1>
          <p className="text-sm text-yellow-100 text-center font-manrope mb-4">
            <strong>Admin Dashboard Access</strong>
          </p>
          <ul className="text-sm text-yellow-100 font-manrope list-disc list-inside text-center space-y-1">
            <li>Manage surveyors & tasks</li>
            <li>View reports and analytics</li>
            <li>Assign & monitor jobs</li>
            <li>Control secure operations</li>
          </ul>
        </div>

        {/* Right Panel */}
        <div className="p-10 md:p-14">
          <h2 className="text-3xl font-bold text-yellow-600 mb-4 font-poppins">
            Admin Login
          </h2>
          <p className="text-sm text-gray-600 mb-6 font-manrope">
            Welcome back, admin. Please enter your credentials to proceed.
          </p>

          <form onSubmit={handleLogin} className="space-y-5 font-manrope" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && (
            <div
              className="mt-4 text-sm text-red-600 text-center"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <p className="mt-6 text-center text-sm text-[#0a1b3d] font-manrope">
            Don’t have an account?{" "}
            <Link to="/admin/signup" className="text-yellow-500 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </section>

      <footer className="mt-6 text-center text-sm text-gray-500 font-manrope">
        © 2025 LandLink. All rights reserved.
      </footer>
    </main>
  );
}
