import { useState, useEffect } from "react"; 
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import loginIllustration from "../assets/my_app.png"; // ✅ Ensure this exists

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
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });
      if (res.data.role !== "admin") {
        setError("Not an admin.");
        setIsSubmitting(false);
        return;
      }
      setUser({ email: res.data.email, role: res.data.role });
      navigate("/admin");
    } catch {
      setError("Login failed.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-6xl bg-white shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
        data-aos="fade-up"
      >
        {/* Left Side: Illustration + Info */}
        <div className="bg-yellow-500 text-white p-10 md:p-12 flex flex-col items-center justify-center">
          <img
            src={loginIllustration}
            alt="Admin Illustration"
            className="w-1/2 max-w-[160px] rounded-xl shadow-lg mb-6"
          />

          <h1 className="text-3xl font-bold mb-2 font-poppins text-center">
            LandLink Admins.
          </h1>
          <p className="text-sm text-yellow-100 text-center font-manrope mb-4">
            <strong>Admin Dashboard </strong>
          </p>
          <ul className="text-sm text-yellow-100 font-manrope list-disc list-inside text-center space-y-1">
            <li>View and manage all surveyors</li>
            <li>Generate detailed reports</li>
            <li>Assign and monitor tasks</li>
            <li>Secure admin operations</li>
          </ul>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-10 md:p-14">
          <h1 className="text-3xl font-bold text-yellow-600 mb-4 font-poppins">
            Admin Login
          </h1>
          <b className="text-sm text-gray-600 mb-6 font-manrope">
            Welcome back, admin! Enter your credentials to access the dashboard.
          </b>

          <form onSubmit={handleLogin} noValidate className="space-y-5 font-manrope">
            <div>
              <label htmlFor="email" className="text-sm text-gray-700 block mb-1 font-medium">
                <i>Email Address</i>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@example.com"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm text-gray-700 block mb-1 font-medium">
                <i>Password</i>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="********"
                className="input"
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
            <p className="mt-4 text-sm text-red-600 text-center" role="alert">
              {error}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-[#0a1b3d] font-manrope">
            Don't have an account?{" "}
            <Link to="/admin/signup" className="text-yellow-500 font-semibold hover:underline">
              <strong>Sign up</strong>
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500 font-manrope">
        © 2025 All rights reserved.
      </p>
    </div>
  );
}
