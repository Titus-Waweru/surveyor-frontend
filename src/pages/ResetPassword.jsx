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
      <div className="min-h-screen flex items-center justify-center bg-[#fff6e5] px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-poppins font-semibold text-yellow-600 mb-4">
            Invalid Reset Link
          </h2>
          <p className="font-manrope text-gray-700">
            Sorry, the password reset link is invalid or expired. Please request a new link.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 inline-block text-sm text-yellow-600 hover:text-yellow-700 font-medium"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff6e5] px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-poppins font-bold text-yellow-600 mb-6 text-center">
          Reset Your Password
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="newPassword" className="block text-gray-700 font-manrope mb-2">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            className="w-full p-3 mb-5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none font-manrope text-gray-900"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            required
            disabled={loading}
            autoComplete="new-password"
          />

          <label htmlFor="confirmPassword" className="block text-gray-700 font-manrope mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none font-manrope text-gray-900"
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
          <p className="mt-6 text-green-600 font-manrope text-center font-medium">{message}</p>
        )}
        {error && (
          <p className="mt-6 text-red-600 font-manrope text-center font-medium">{error}</p>
        )}

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-6 text-yellow-600 hover:text-yellow-700 text-sm font-medium"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
