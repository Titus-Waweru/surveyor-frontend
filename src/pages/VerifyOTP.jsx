import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion'; // uncomment if you use animations from framer-motion

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 120; // OTP expiry countdown in seconds

export default function VerifyOTP() {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // State declarations
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  // Start countdown timer
  function startCountdown() {
    clearInterval(timerRef.current);
    setSecondsLeft(COUNTDOWN_SECONDS);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // Format time in MM:SS for display
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only digits allowed

    const newOtp = [...otpDigits];
    newOtp[index] = value.slice(-1);
    setOtpDigits(newOtp);

    // Auto-focus next input if current is filled
    if (value && index < OTP_LENGTH - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle OTP submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otpDigits.some((digit) => digit === '')) {
      setError('Please enter all OTP digits');
      return;
    }

    const otp = otpDigits.join('');

    try {
      // Example: replace with your API call
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });

      if (!res.ok) throw new Error('Invalid OTP or expired');

      setSuccess('OTP verified successfully!');
      // Navigate or do next step after success
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'Verification failed');
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    setResending(true);
    setError('');
    setSuccess('');
    try {
      // Replace with your resend OTP API call
      const res = await fetch('/api/resend-otp', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to resend OTP');
      setSuccess('OTP resent successfully!');
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      startCountdown();
    } catch (err) {
      setError(err.message || 'Could not resend OTP');
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    startCountdown();
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-yellow-50 p-4 font-poppins">
      <h1 className="text-3xl font-semibold mb-6">Verify OTP</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <div className="flex justify-between mb-4">
          {otpDigits.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              maxLength={1}
              className="w-12 h-12 text-center border border-gray-300 rounded text-xl focus:outline-yellow-400"
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !otpDigits[idx]) {
                  if (idx > 0) {
                    const prevInput = document.getElementById(`otp-${idx - 1}`);
                    if (prevInput) prevInput.focus();
                  }
                }
              }}
            />
          ))}
        </div>

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded font-semibold"
          disabled={secondsLeft === 0}
        >
          Verify OTP
        </button>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            Expires in: {formatTime(secondsLeft)}
          </p>
          <button
            type="button"
            className={`text-yellow-600 font-semibold underline ${resending ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={resending || secondsLeft > 0}
            onClick={handleResend}
          >
            {resending ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>
      </form>
    </div>
  );
}
