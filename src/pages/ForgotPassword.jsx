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
        setMessage(data.message || "If the email exists in our system, a password reset link has been sent. Please check your inbox.");
      } else {
        setError(data.message || "Oops! Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-start justify-center py-16 px-4 font-manrope">
      <div
        className="bg-white max-w-md w-full rounded-3xl shadow-xl p-10"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-poppins font-bold text-yellow-600 mb-6 text-center">
          Forgot your password?
        </h2>
        <p className="text-gray-700 mb-8 text-center leading-relaxed">
          Enter the email address associated with your account below, and we’ll send you a link to reset your password quickly and securely.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email" className="block mb-2 font-semibold text-gray-800">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-yellow-400 focus:ring-2 focus:ring-yellow-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <button
            type="submit"
            className={`w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition ${
              loading || !email ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={loading || !email}
          >
            {loading ? "Sending reset instructions..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-green-600 font-medium">{message}</p>
        )}
        {error && (
          <p className="mt-6 text-center text-red-600 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}
