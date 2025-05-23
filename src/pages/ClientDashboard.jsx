// src/pages/ClientDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import OverviewCards from "../components/dashboard/OverviewCards.jsx";
import BookingsTable from "../components/dashboard/BookingsTable.jsx";
import BookingForm from "../components/dashboard/BookingForm.jsx";

export default function ClientDashboard({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookings?userEmail=${encodeURIComponent(user.email)}`
      );
      setBookings(res.data);
    } catch (err) {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchBookings();
  }, [user?.email]);

  return (
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.name?.split(" ")[0] || "User"} 👋
        </h1>
      </div>

      {/* Overview Cards */}
      <OverviewCards bookings={bookings} loading={loading} error={error} />

      {/* Recent Bookings */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Recent Bookings</h2>
        {loading ? (
          <div className="text-yellow-500 font-medium animate-pulse">
            Loading bookings...
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-600">No bookings found.</p>
        ) : (
          <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
            <BookingsTable bookings={bookings} />
          </div>
        )}
      </section>

      {/* Booking Form */}
      <section className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Book a Service</h2>
        <BookingForm userEmail={user.email} onNewBooking={fetchBookings} />
      </section>
    </div>
  );
}
