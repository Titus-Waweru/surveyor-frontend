import React, { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Payments({ user }) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (user?.email) {
      AOS.init({ duration: 1000 });

      async function fetchPayments() {
        try {
          const res = await axios.get(`${API_BASE}/payment?email=${user.email}`);
          setPayments(res.data.payments || []);
        } catch (err) {
          console.error("Failed to fetch payments", err);
        }
      }

      fetchPayments();
    }
  }, [user?.email]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setMessage(null);

    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount" });
      return;
    }

    if (paymentMethod === "mpesa" && (!phone || !/^254\d{9}$/.test(phone))) {
      setMessage({ type: "error", text: "Enter a valid Kenyan phone number starting with 254" });
      return;
    }

    setLoading(true);

    try {
      let res;

      if (paymentMethod === "mpesa") {
        res = await axios.post(`${API_BASE}/payment/mpesa`, {
          phone,
          amount: numericAmount,
          email: user.email,
        });

        if (res.data?.success) {
          setMessage({ type: "success", text: "STK Push sent. Complete payment on your phone." });
        } else {
          setMessage({ type: "error", text: "Failed to initiate M-Pesa payment" });
        }
      } else {
        res = await axios.post(`${API_BASE}/payment/paystack`, {
          email: user.email,
          amount: numericAmount,
        });

        if (res.data?.url) {
          window.location.href = res.data.url;
        } else {
          setMessage({ type: "error", text: "Failed to initiate Paystack payment" });
        }
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Payment initiation failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] px-6 py-8 font-manrope">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 md:p-14" data-aos="fade-up">
        <h1 className="text-3xl font-bold text-yellow-600 mb-6 text-center font-poppins">
          Payments
        </h1>

        {message && (
          <div
            aria-live="polite"
            className={`mb-6 px-4 py-2 rounded text-center ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handlePayment} className="mb-10 space-y-6">
          <div>
            <label className="block font-medium mb-1" htmlFor="amount">
              Amount (KES)
            </label>
            <input
              type="number"
              id="amount"
              min="1"
              step="any"
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
              <option value="mpesa">Mpesa</option>
            </select>
          </div>

          {paymentMethod === "mpesa" && (
            <div>
              <label className="block font-medium mb-1" htmlFor="phone">
                M-Pesa Phone Number (Format: 2547XXXXXXXX)
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="e.g. 254712345678"
                required
              />
            </div>
          )}

          {paymentMethod === "paystack" && (
            <div className="bg-yellow-50 border border-yellow-300 p-4 rounded text-sm text-yellow-700">
              <p className="mb-1 font-semibold">Instructions:</p>
              <ul className="list-disc list-inside">
                <li>You will be redirected to Paystack.</li>
                <li>Follow the prompts to complete payment securely.</li>
                <li>Ensure your email is correct for verification.</li>
              </ul>
            </div>
          )}

          {paymentMethod === "mpesa" && (
            <div className="bg-yellow-50 border border-yellow-300 p-4 rounded text-sm text-yellow-700">
              <p className="mb-1 font-semibold">Instructions:</p>
              <ul className="list-disc list-inside">
                <li>Ensure your phone number starts with 2547 and is M-Pesa registered.</li>
                <li>You will receive a STK Push on your phone to authorize the payment.</li>
                <li>Enter your M-Pesa PIN when prompted on your device.</li>
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-white font-semibold px-6 py-2 rounded hover:bg-yellow-500 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Make Payment"}
          </button>
        </form>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Recent Payments</h2>
          {payments.length === 0 ? (
            <p className="text-gray-600">No payments found.</p>
          ) : (
            <div className="overflow-x-auto">
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
                        {(p.amount / (p.method === "paystack" ? 100 : 1)).toFixed(2)}
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
