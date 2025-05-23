"use client";

import axios from "axios";

export default function PaystackButton({ email, amount }) {
  const handlePayment = async () => {
    try {
      const response = await axios.post("/api/payment/initiate", {
        email,
        amount, // in KES, e.g., 2000
      });

      const { url } = response.data;
      window.location.href = url; // Redirect to Paystack
    } catch (error) {
      console.error("Payment Error:", error.response?.data || error.message);
      alert("Failed to start payment.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
    >
      Pay Now
    </button>
  );
}
