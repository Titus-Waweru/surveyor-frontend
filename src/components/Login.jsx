import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export default function Login({ onSubmit }) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 });
    checkLoginStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  function checkLoginStatus() {
    const now = Date.now();
    const blockedUntil = parseInt(localStorage.getItem("loginBlockedUntil") || "0", 10);

    if (blockedUntil && now < blockedUntil) {
      setIsBlocked(true);
      setRetryAfter(Math.ceil((blockedUntil - now) / 1000));
      startCountdown(blockedUntil - now);
      return;
    }

    if (blockedUntil && now >= blockedUntil) {
      localStorage.removeItem("loginBlockedUntil");
      localStorage.removeItem("loginAttempts");
    }

    setIsBlocked(false);
    setRetryAfter(0);
  }

  function startCountdown(initialMs) {
    let remaining = initialMs;
    const interval = setInterval(() => {
      remaining -= 1000;
      setRetryAfter(Math.max(0, Math.ceil(remaining / 1000)));

      if (remaining <= 0) {
        clearInterval(interval);
        setIsBlocked(false);
        setRetryAfter(0);
        localStorage.removeItem("loginBlockedUntil");
        localStorage.removeItem("loginAttempts");
      }
    }, 1000);
  }

  function recordFailedAttempt() {
    const attempts = JSON.parse(localStorage.getItem("loginAttempts") || "[]");
    attempts.push(Date.now());
    localStorage.setItem("loginAttempts", JSON.stringify(attempts));

    if (attempts.length >= MAX_ATTEMPTS) {
      const blockedUntil = Date.now() + BLOCK_DURATION_MS;
      localStorage.setItem("loginBlockedUntil", blockedUntil.toString());
      localStorage.removeItem("loginAttempts");
      setIsBlocked(true);
      setRetryAfter(Math.ceil(BLOCK_DURATION_MS / 1000));
      startCountdown(BLOCK_DURATION_MS);
    }
  }

  function clearAttempts() {
    localStorage.removeItem("loginAttempts");
    localStorage.removeItem("loginBlockedUntil");
  }

  const onSubmitWrapper = async (formData) => {
    if (isBlocked) {
      setFormError(
        `Too many failed logins. Please try again in ${Math.ceil(retryAfter / 60)} mins`
      );
      return;
    }

    try {
      await onSubmit(formData);
      clearAttempts();
      setFormError("");
    } catch (error) {
      recordFailedAttempt();
      checkLoginStatus();
      setFormError(error.response?.data?.message || "Login failed");
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
          <div className="bg-white p-3 rounded-full mb-6">
            <img
              src={logo}
              alt="LandLink Logo"
              className="h-[100px] w-auto max-w-[220px] object-contain"
            />
          </div>
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
          <h2 className="text-3xl font-bold text-green-600 mb-3 font-poppins">
            Login
          </h2>
          <p className="text-sm text-gray-600 mb-6 font-manrope">
            Welcome back! Please enter your credentials to access your dashboard.
          </p>

          <form
            onSubmit={handleSubmit(onSubmitWrapper)}
            noValidate
            className="space-y-5 font-manrope"
          >
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
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

            {/* Error message */}
            {formError && (
              <motion.p
                className="text-red-600 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {formError}
              </motion.p>
            )}

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                <strong>Forgot password?</strong>
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || isBlocked}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2.5 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {isSubmitting
                ? "Logging in..."
                : isBlocked
                ? `Try again in ${Math.ceil(retryAfter / 60)} min`
                : "Login"}
            </button>
          </form>

          {/* Signup Prompt */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-yellow-600 hover:underline font-semibold"
            >
              <strong>Sign up here</strong>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
