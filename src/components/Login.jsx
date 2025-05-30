import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });

    // Auto-redirect if already logged in
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token && role) {
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "surveyor") navigate("/surveyor/dashboard");
      else navigate("/dashboard");
    }
  }, [navigate]);

  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (formData) => {
    const emailKey = `loginAttempts_${formData.email}`;
    const record = JSON.parse(localStorage.getItem(emailKey)) || {
      count: 0,
      blockedUntil: null,
    };

    const now = Date.now();
    if (record.blockedUntil && now < record.blockedUntil) {
      alert("Too many failed attempts. Please try again after 24 hours.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password.trim(),
            rememberMe,
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Login failed");
      }

      // Reset login attempts on successful login
      localStorage.removeItem(emailKey);

      const data = await response.json();
      console.log("Login success:", data);

      // Save token and role
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.role);

      // Redirect based on role
      if (data.role === "admin") navigate("/admin/dashboard");
      else if (data.role === "surveyor") navigate("/surveyor/dashboard");
      else navigate("/dashboard");
    } catch (err) {
      const newCount = record.count + 1;
      const newRecord = {
        count: newCount,
        blockedUntil: newCount >= 7 ? now + 24 * 60 * 60 * 1000 : null,
      };
      localStorage.setItem(emailKey, JSON.stringify(newRecord));

      console.error("Login error:", err);
      alert(err.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-10 font-manrope">
      <div
        data-aos="fade-up"
        className="w-full max-w-6xl bg-white shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Left Section */}
        <div className="bg-yellow-500 text-white p-10 md:p-12 flex flex-col items-center justify-center">
          <img
            src={logo}
            alt="LandLink Logo"
            className="h-[100px] w-auto max-w-[220px] object-contain mb-6"
          />
          <h1 className="text-3xl font-bold font-poppins mb-2 text-center">
            LandLink Platform
          </h1>
          <p className="text-sm text-yellow-100 font-manrope text-center mb-4">
            <strong>MOTTO:</strong> “Survey Services at Your Fingertips.”
          </p>
          <ul className="text-sm text-yellow-100 font-manrope list-disc list-inside text-center space-y-1">
            <li>Secure and reliable access</li>
            <li>Manage your projects in real time</li>
            <li>Designed for modern teams</li>
            <li>We come in to help people</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="p-10 md:p-14 bg-white">
          <h2 className="text-3xl font-bold text-yellow-600 mb-3 font-poppins">
            Login
          </h2>
          <p className="text-sm text-gray-600 mb-6 font-manrope">
            Welcome back! Please enter your credentials to access your
            dashboard.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5 font-manrope"
          >
            {/* Email Field */}
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
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
                className="input"
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    id="email-error"
                    className="text-red-600 mt-1 text-sm"
                    role="alert"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Field */}
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
                placeholder="********"
                autoComplete="current-password"
                {...register("password")}
                className="input"
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
              />
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    id="password-error"
                    className="text-red-600 mt-1 text-sm"
                    role="alert"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2.5 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-yellow-600 hover:underline font-semibold"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
