// src/pages/ClientOverview.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ClientOverview({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    async function fetchBookings() {
      try {
        const res = await axios.get(`http://localhost:5000/api/bookings?userEmail=${user.email}`);
        setBookings(res.data);
      } catch (err) {
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [user.email]);

  const total = bookings.length;
  const pending = bookings.filter(b => b.status === "Pending").length;
  const completed = bookings.filter(b => b.status === "Completed").length;
  const inProgress = bookings.filter(b => b.status === "In Progress").length;

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-4xl bg-white shadow-xl rounded-3xl p-10 md:p-14"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold text-yellow-600 text-center mb-6 font-poppins">
          <strong>Client Overview</strong>
        </h1>

        {loading ? (
          <p className="text-center text-sm text-gray-600 font-manrope">Loading overview...</p>
        ) : error ? (
          <p className="text-center text-sm text-red-600 font-manrope">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-manrope">
            <StatCard label="Total Bookings" value={total} color="blue" />
            <StatCard label="Pending" value={pending} color="yellow" />
            <StatCard label="In Progress" value={inProgress} color="purple" />
            <StatCard label="Completed" value={completed} color="green" />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <div className={`p-6 rounded-xl shadow text-center ${colorMap[color]}`}>
      <h3 className="text-sm font-medium mb-1">{label}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
