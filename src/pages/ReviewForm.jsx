// src/pages/ReviewForm.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export default function ReviewForm({ user }) {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(`${API_BASE}/reviews`, {
        bookingId,
        reviewer: user.email,
        role: user.role, // client or surveyor
        rating,
        comment,
      });

      if (res.data.success) {
        setMessage({ type: "success", text: "Review submitted successfully!" });
        setTimeout(() => navigate(`/${user.role}/bookings`), 2000);
      } else {
        setMessage({ type: "error", text: "Failed to submit review." });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-8 font-manrope">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-yellow-600 text-center font-poppins">Leave a Review</h2>

        {message && (
          <div className={`mb-4 px-4 py-2 rounded text-center ${
            message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Rating (1–5)</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Write your feedback here..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-white font-semibold py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
