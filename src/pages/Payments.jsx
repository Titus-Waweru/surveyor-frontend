// src/pages/Payments.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Payments({ user }) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    async function fetchPayments() {
      try {
        const res = await axios.get(`/api/payments?email=${user.email}`);
        setPayments(res.data.payments || []);
      } catch (err) {
        console.error("Failed to fetch payments", err);
      }
    }
    if (user?.email) fetchPayments();
  }, [user]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const paymentData = {
        email: user.email,
        amount: Number(amount) * 100,
        method: paymentMethod,
      };

      const res = await axios.post("/api/payments/initiate", paymentData);

      if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        setMessage({ type: "error", text: "Failed to initiate payment" });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Payment initiation failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-5xl bg-white shadow-xl rounded-3xl p-10 md:p-14"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold text-yellow-600 mb-6 text-center font-poppins">
          Payments
        </h1>

        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded font-manrope text-center ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handlePayment} className="mb-10 space-y-6 font-manrope">
          <div>
            <label className="block font-medium mb-1" htmlFor="amount">
              Amount (KES)
            </label>
            <input
              type="number"
              id="amount"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter amount to pay"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="paymentMethod">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="paystack">Paystack</option>
              <option value="mpesa">Mpesa (Coming soon)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-white font-semibold px-6 py-2 rounded hover:bg-yellow-500 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Make Payment"}
          </button>
        </form>

        <section>
          <h2 className="text-2xl font-semibold mb-4 font-manrope">Recent Payments</h2>
          {payments.length === 0 ? (
            <p className="text-gray-600 font-manrope">No payments found.</p>
          ) : (
            <div className="overflow-x-auto font-manrope">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-yellow-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Amount (KES)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Method</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-yellow-100">
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(p.createdAt).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {(p.amount / 100).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 capitalize">{p.method}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span
                          className={`font-semibold ${
                            p.status === "success"
                              ? "text-green-600"
                              : p.status === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
