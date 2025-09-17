import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import API from "../utils/axios";
import OverviewCards from "../components/dashboard/OverviewCards.jsx";
import BookingsTable from "../components/dashboard/BookingsTable.jsx";
import BookingForm from "../components/dashboard/BookingForm.jsx";
import BookingMap from "../components/dashboard/BookingMap.jsx";

export default function ClientDashboard({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(
        `/bookings?userEmail=${encodeURIComponent(user.email)}`
      );
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
    if (user?.email) {
      fetchBookings();
    }
  }, [user?.email]);

  return (
    <div className="min-h-screen bg-[#fff6e5] py-12 px-2 sm:px-4 font-manrope flex justify-center items-start overflow-x-hidden">
      <div
        className="w-full max-w-6xl bg-white shadow-xl rounded-3xl px-4 sm:px-6 md:px-10 py-8 mx-auto space-y-10"
        data-aos="fade-up"
      >
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 font-poppins">
            Welcome, {user?.name?.split(" ")[0] || "User"} 👋
          </h1>
        </header>

        {/* Overview Cards */}
        <section>
          <OverviewCards bookings={bookings} loading={loading} error={error} />
        </section>

        {/* Booking Map */}
        <section className="bg-white rounded-2xl shadow-md px-6 py-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            🌍 Your Active Bookings on Map
          </h2>
          <BookingMap bookings={bookings} />
        </section>

        {/* Booking Form */}
        <section className="bg-white rounded-2xl shadow-md px-6 py-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            📋 Book a New Service
          </h2>
          <BookingForm userEmail={user.email} onNewBooking={fetchBookings} />
        </section>

        {/* Recent Bookings */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            📑 Recent Bookings
          </h2>
          {loading ? (
            <div className="text-yellow-500 font-medium animate-pulse">
              Loading your bookings...
            </div>
          ) : error ? (
            <p className="text-red-600 font-medium">{error}</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-600">
              No bookings found. Try booking a service above!
            </p>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
              <BookingsTable bookings={bookings} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
