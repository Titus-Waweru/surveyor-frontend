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
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const email = localStorage.getItem("pendingEmail");
  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!email) navigate("/signup");

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 1) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
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
      const res = await axios.post(`${baseURL}/api/auth/verify-otp`, {
        email,
        otp,
      });

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
      await axios.post(`${baseURL}/api/auth/resend-otp`, { email });
      setOtpDigits(["", "", "", "", "", ""]);
      setSecondsLeft(180);
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
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded bg-white text-center font-manrope">
      <h2 className="text-xl font-semibold mb-4 text-yellow-600">Verify Your Email</h2>
      <p className="text-gray-600 mb-4 text-sm">
        Enter the 6-digit code sent to your email. Expires in <b>{formatTime(secondsLeft)}</b>
      </p>

      <form onSubmit={handleVerify}>
        <div className="flex justify-center gap-2 mb-4">
          {otpDigits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              type="text"
              maxLength="1"
              className="w-12 h-12 text-xl text-center border rounded border-gray-300 focus:outline-yellow-500"
              inputMode="numeric"
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
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded transition disabled:opacity-50"
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
  );
}
