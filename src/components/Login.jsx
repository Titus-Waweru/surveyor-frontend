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
        `Too many failed login attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`
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
      setFormError(error.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-slate-50 flex items-center justify-center px-4 py-8 font-inter">
      <div
        data-aos="fade-up"
        data-aos-delay="200"
        className="w-full max-w-5xl bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-white/20"
      >
        {/* Enhanced Left Section */}
        <div className="relative bg-gradient-to-br from-amber-500 to-amber-600 text-white p-8 lg:p-12 flex flex-col items-center justify-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20 mb-8 inline-block">
              <img
                src={logo}
                alt="LandLink - Connecting Surveyors & Clients"
                className="h-20 lg:h-24 w-auto object-contain filter drop-shadow-lg"
              />
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-bold mb-3 font-poppins tracking-tight">
              Welcome to LandLink
            </h1>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 mb-6">
              <p className="text-amber-100 text-sm font-medium mb-2">
                <span className="font-semibold text-white">MOTTO:</span> "Survey Services at Your Fingertips"
              </p>
              
              <div className="space-y-2 text-left">
                {[
                  "Secure and reliable access",
                  "Manage projects in real-time", 
                  "Designed for modern teams",
                  "We come in to help people"
                ].map((feature, index) => (
                  <motion.div 
                    key={feature}
                    className="flex items-center text-amber-100 text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-amber-300 rounded-full mr-3 flex-shrink-0" />
                    {feature}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Right Section */}
        <div className="p-8 lg:p-12 bg-white">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center lg:text-left mb-8">
              <motion.h2 
                className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent font-poppins mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome Back
              </motion.h2>
              <motion.p 
                className="text-slate-600 text-sm font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Sign in to access your survey projects and client dashboard
              </motion.p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmitWrapper)}
              noValidate
              className="space-y-6"
            >
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register("email")}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl shadow-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                  disabled={isBlocked}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      id="email-error"
                      className="text-red-600 mt-2 text-sm font-medium flex items-center"
                      role="alert"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password")}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl shadow-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  aria-invalid={!!errors.password}
                  aria-describedby="password-error"
                  disabled={isBlocked}
                />
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      id="password-error"
                      className="text-red-600 mt-2 text-sm font-medium flex items-center"
                      role="alert"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Form Error */}
              <AnimatePresence>
                {formError && (
                  <motion.div
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <p className="text-red-700 text-sm font-medium flex items-center">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {formError}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || isBlocked}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : isBlocked ? (
                  `Try again in ${formatTime(retryAfter)}`
                ) : (
                  "Sign In to Dashboard"
                )}
              </motion.button>
            </form>

            {/* Signup Prompt */}
            <motion.div 
              className="text-center mt-8 pt-6 border-t border-slate-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-slate-600 text-sm">
                New to LandLink?{" "}
                <Link
                  to="/signup"
                  className="text-amber-600 hover:text-amber-700 font-semibold transition-colors duration-200"
                >
                  Create an account
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}