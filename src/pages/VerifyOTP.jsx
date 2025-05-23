// src/pages/VerifyOTP.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const email = localStorage.getItem("pendingEmail");
      if (!email) throw new Error("Session expired. Please sign up again.");

      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });

      alert("✅ OTP verified. You can now log in.");
      localStorage.removeItem("pendingEmail");
      localStorage.removeItem("pendingRole");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded bg-white">
      <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>
      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="border px-4 py-2 w-full rounded"
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">
          Verify
        </button>
      </form>
    </div>
  );
}
