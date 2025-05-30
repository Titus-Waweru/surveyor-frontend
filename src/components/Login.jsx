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
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export default function Login({ setUser }) {
  // setUser is your state setter from App or parent component to track logged-in user

  const [isBlocked, setIsBlocked] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    checkLoginAttempts();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  function checkLoginAttempts() {
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem("loginAttempts")) || [];
    // filter out old attempts outside window
    const recent = attempts.filter((ts) => now - ts < ATTEMPT_WINDOW_MS);

    if (recent.length >= MAX_ATTEMPTS) {
      const retryIn = ATTEMPT_WINDOW_MS - (now - recent[0]);
      setIsBlocked(true);
      setRetryAfter(Math.ceil(retryIn / 1000));

      const interval = setInterval(() => {
        setRetryAfter((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsBlocked(false);
            localStorage.removeItem("loginAttempts");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }

  function recordFailedAttempt() {
    const attempts = JSON.parse(localStorage.getItem("loginAttempts")) || [];
    attempts.push(Date.now());
    localStorage.setItem("loginAttempts", JSON.stringify(attempts));
  }

  function clearAttempts() {
    localStorage.removeItem("loginAttempts");
  }

  const onSubmit = async (formData) => {
    if (isBlocked) {
      alert(`Too many attempts. Please wait ${retryAfter} seconds.`);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password.trim(),
        }),
      });

      if (!res.ok) {
        recordFailedAttempt();
        checkLoginAttempts();

        const errData = await res.json();
        throw new Error(errData.message || "Login failed");
      }

      clearAttempts();
      const data = await res.json();

      // Save token + user in localStorage like your existing flow
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      // Update parent/app state to logged in user to prevent auto logout
      setUser({
        id: data.id,
        email: data.email,
        role: data.role,
        status: data.status,
      });
    } catch (error) {
      alert(error.message || "Login failed");
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

        {/* Right Section - Login Form */}
        <div className="p-10 md:p-14 bg-white">
          <h2 className="text-3xl font-bold text-yellow-600 mb-3 font-poppins">
            Login
          </h2>
          <p className="text-sm text-gray-600 mb-6 font-manrope">
            Welcome back! Please enter your credentials to access your dashboard.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5 font-manrope"
          >
            {/* Email */}
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

            {/* Password */}
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

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-yellow-600 hover:underline font-medium"
              >
                Forgot password?
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
                ? `Try again in ${retryAfter}s`
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
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
