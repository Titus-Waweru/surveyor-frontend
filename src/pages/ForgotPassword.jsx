import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/request-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "If the email exists, a reset link has been sent.");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-yellow-600">Reset Password</h2>
        <p className="text-gray-600 mb-6">
          Enter your email address and we’ll send you instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <button
            type="submit"
            className={`w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={loading || !email}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
}
