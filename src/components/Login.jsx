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

const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;

export default function Login() {
  const navigate = useNavigate();
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const attempts = JSON.parse(localStorage.getItem("loginAttempts")) || [];
    const now = Date.now();
    const recentAttempts = attempts.filter(ts => now - ts < ATTEMPT_WINDOW_MS);
    if (recentAttempts.length >= MAX_ATTEMPTS) {
      setIsBlocked(true);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const recordFailedAttempt = () => {
    const attempts = JSON.parse(localStorage.getItem("loginAttempts")) || [];
    attempts.push(Date.now());
    localStorage.setItem("loginAttempts", JSON.stringify(attempts));
  };

  const clearAttempts = () => {
    localStorage.removeItem("loginAttempts");
  };

  const onSubmit = async (formData) => {
    if (isBlocked) {
      alert("Too many login attempts. Please try again later.");
      return;
    }

    try {
      localStorage.clear();
      sessionStorage.clear();

      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password.trim(),
        }),
      });

      if (!response.ok) {
        recordFailedAttempt();
        const errData = await response.json();
        throw new Error(errData.message || "Login failed");
      }

      clearAttempts();
      const data = await response.json();

      const userPayload = {
        id: data.id,
        email: data.email,
        role: data.role,
        status: data.status,
      };

      // Always store in sessionStorage
      sessionStorage.setItem("user", JSON.stringify(userPayload));

      switch (data.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "surveyor":
          navigate("/surveyor/dashboard");
          break;
        case "client":
          navigate("/client/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
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
          <h2 className="text-3xl font-bold text-yellow-600 mb-3 font-poppins">Login</h2>
          <p className="text-sm text-gray-600 mb-6 font-manrope">
            Welcome back! Please enter your credentials to access your dashboard.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 font-manrope">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-yellow-600 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || isBlocked}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2.5 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : isBlocked ? "Blocked" : "Login"}
            </button>
          </form>

          {/* Sign Up */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-yellow-600 hover:underline font-semibold">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
