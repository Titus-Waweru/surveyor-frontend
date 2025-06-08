import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function VerifyOTP() {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(180);
  const timerRef = useRef(null);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const email = localStorage.getItem("pendingEmail");
  const baseURL = import.meta.env.VITE_API_URL;

  const startCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!email) navigate("/signup");
    startCountdown();
    return () => clearInterval(timerRef.current);
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      setError("Please enter the full 6-digit OTP.");
      return;
    }

    try {
      await axios.post(`${baseURL}/auth/verify-otp`, { email, otp });
      setSuccess("✅ OTP verified. Redirecting...");
      setTimeout(() => {
        localStorage.removeItem("pendingEmail");
        localStorage.removeItem("pendingRole");
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "❌ Invalid or expired OTP.");
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await axios.post(`${baseURL}/auth/resend-otp`, { email });
      setOtpDigits(["", "", "", "", "", ""]);
      setSecondsLeft(180);
      startCountdown();
    } catch (err) {
      setError("Failed to resend OTP.");
    }
    setResending(false);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-[#fff6e5] px-4 py-16 font-manrope">
      <div
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 sm:p-10 text-center"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-poppins font-bold text-yellow-600 mb-6">
          Verify Your Email
        </h2>
        <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
          Enter the 6-digit code sent to <b>{email}</b><br />
          Code expires in <b>{formatTime(secondsLeft)}</b>
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 max-w-xs mx-auto">
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                aria-label={`OTP digit ${i + 1}`}
                className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 text-lg sm:text-xl md:text-2xl text-center border border-gray-300 rounded-xl focus:outline-yellow-500 focus:ring-2 focus:ring-yellow-400 transition-all font-manrope text-gray-900"
              />
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                className="text-red-600 text-sm font-medium font-manrope"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                className="text-green-600 text-sm font-medium font-manrope"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {success}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={secondsLeft <= 0}
            className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white font-poppins font-semibold py-3 rounded-lg transition shadow ${
              secondsLeft <= 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Verify OTP
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={resending || secondsLeft > 0}
          className="w-full mt-6 text-yellow-600 hover:text-yellow-700 text-sm font-medium font-poppins transition-colors disabled:opacity-50"
        >
          {resending ? "Resending..." : "Didn't receive OTP? Resend"}
        </button>

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-4 text-yellow-600 hover:text-yellow-700 text-sm font-medium font-poppins transition-colors"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
