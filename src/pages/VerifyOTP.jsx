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

  // Start countdown timer
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
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
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
      startCountdown(); // Restart countdown after resend
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
    <div className="bg-[#fff6e5] min-h-screen flex items-center justify-center px-4 py-10 sm:px-6 sm:py-12 font-poppins">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 sm:p-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-yellow-600 mb-4">Verify Your Email</h2>
        <p className="text-gray-700 mb-6 text-sm sm:text-base">
          Enter the 6-digit code sent to <b>{email}</b><br />
          Code expires in <b>{formatTime(secondsLeft)}</b>
        </p>

        <form onSubmit={handleVerify}>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-5 max-w-xs mx-auto">
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                type="text"
                maxLength="1"
                inputMode="numeric"
                className="w-10 h-10 text-lg text-center border border-gray-300 rounded-xl focus:outline-yellow-500 sm:w-11 sm:h-11 sm:text-xl md:w-12 md:h-12 md:text-2xl transition-all"
              />
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                className="text-red-600 text-sm mb-3"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                className="text-green-600 text-sm mb-3"
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
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-2xl shadow transition disabled:opacity-50"
          >
            Verify OTP
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={resending || secondsLeft > 0}
          className="mt-4 text-sm text-yellow-600 hover:underline disabled:opacity-50"
        >
          {resending ? "Resending..." : "Didn't receive OTP? Resend"}
        </button>
      </div>
    </div>
  );
}
