import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!email || !token) {
      setError("Invalid password reset link.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token, newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Password reset successful! You can now log in.");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff6e5] px-4 py-20 font-manrope">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-10 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-poppins font-semibold text-yellow-600 mb-5">
            Invalid Reset Link
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Sorry, the password reset link is invalid or has expired. Please request a new password reset link to continue.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-8 inline-block text-yellow-600 hover:text-yellow-700 font-medium text-sm font-poppins transition-colors"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-[#fff6e5] px-4 py-16 font-manrope">
      <div
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-poppins font-bold text-yellow-600 mb-8 text-center">
          Reset Your Password
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="newPassword" className="block mb-2 font-semibold text-gray-800">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-yellow-400 focus:ring-2 focus:ring-yellow-400 transition font-manrope text-gray-900"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            required
            disabled={loading}
            autoComplete="new-password"
          />

          <label htmlFor="confirmPassword" className="block mb-2 font-semibold text-gray-800">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            className="w-full p-3 mb-8 border border-gray-300 rounded-lg focus:outline-yellow-400 focus:ring-2 focus:ring-yellow-400 transition font-manrope text-gray-900"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
            disabled={loading}
            autoComplete="new-password"
          />

          <button
            type="submit"
            className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white font-poppins font-semibold py-3 rounded-lg transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading || !newPassword || !confirmPassword}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="mt-8 text-green-600 font-medium text-center font-manrope">{message}</p>
        )}
        {error && (
          <p className="mt-8 text-red-600 font-medium text-center font-manrope">{error}</p>
        )}

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-10 text-yellow-600 hover:text-yellow-700 text-sm font-medium font-poppins transition-colors"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
