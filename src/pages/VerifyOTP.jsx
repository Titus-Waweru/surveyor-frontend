import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Clock, ArrowLeft, ShieldCheck } from "lucide-react";

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
  }, [email, navigate]); // Fixed: Added missing dependencies

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
      setSuccess("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        localStorage.removeItem("pendingEmail");
        localStorage.removeItem("pendingRole");
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await axios.post(`${baseURL}/auth/resend-otp`, { email });
      setOtpDigits(["", "", "", "", "", ""]);
      setSecondsLeft(180);
      startCountdown();
      setError("");
      setSuccess("New OTP sent successfully!");
    } catch (error) { // Fixed: Renamed 'err' to 'error'
      setError("Failed to resend OTP. Please try again.");
    }
    setResending(false);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-slate-50 flex items-center justify-center px-4 py-8 font-inter">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm max-w-md w-full rounded-2xl shadow-2xl border border-white/20 p-8 lg:p-10"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-100 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          <motion.h2 
            className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent font-poppins mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Verify Your Email
          </motion.h2>
          <motion.p 
            className="text-slate-600 text-sm font-medium leading-relaxed mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Enter the 6-digit verification code sent to
          </motion.p>
          <motion.p 
            className="text-amber-700 font-semibold text-sm mb-4 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Mail className="w-4 h-4" />
            {email}
          </motion.p>
          
          {/* Timer Display */}
          <motion.div 
            className="flex items-center justify-center gap-2 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Clock className={`w-4 h-4 ${secondsLeft < 60 ? 'text-red-500' : 'text-amber-600'}`} />
            <span className={secondsLeft < 60 ? 'text-red-600' : 'text-slate-700'}>
              Code expires in <span className="font-bold">{formatTime(secondsLeft)}</span>
            </span>
          </motion.div>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          {/* Enhanced OTP Inputs */}
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
            {otpDigits.map((digit, i) => (
              <motion.input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                aria-label={`OTP digit ${i + 1}`}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-2xl sm:text-3xl font-bold text-center border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm text-slate-800 shadow-sm"
                whileFocus={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              />
            ))}
          </div>

          {/* Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="p-4 bg-red-50 border border-red-200 rounded-xl"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </motion.div>
            )}
            {success && (
              <motion.div
                className="p-4 bg-green-50 border border-green-200 rounded-xl"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-green-700 text-sm font-medium">{success}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Verify Button */}
          <motion.button
            type="submit"
            disabled={secondsLeft <= 0}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <ShieldCheck className="w-5 h-5" />
            Verify OTP
          </motion.button>
        </form>

        {/* Resend OTP */}
        <motion.button
          onClick={handleResend}
          disabled={resending || secondsLeft > 0}
          className="w-full mt-6 text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {resending ? (
            <>
              <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              Sending new code...
            </>
          ) : (
            "Didn't receive the code? Resend OTP"
          )}
        </motion.button>

        {/* Back to Login */}
        <motion.button
          onClick={() => navigate("/login")}
          className="w-full mt-4 text-slate-600 hover:text-slate-700 font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back to Login
        </motion.button>

        {/* Security Note */}
        <motion.div 
          className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-slate-700 text-xs font-semibold mb-1">Secure Verification</p>
              <p className="text-slate-500 text-xs">
                This code ensures your account security and will expire for your protection.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}