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
    AOS.init({ duration: 1000, once: true });

    // Refresh AOS on load + resize to fix mobile charts rendering
    const handleRefresh = () => AOS.refresh();
    window.addEventListener("load", handleRefresh);
    window.addEventListener("resize", handleRefresh);

    if (user?.email) {
      fetchBookings();
    }

    return () => {
      window.removeEventListener("load", handleRefresh);
      window.removeEventListener("resize", handleRefresh);
    };
  }, [user?.email]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-10 font-manrope">
      {/* Header */}
      <header
        className="flex justify-between items-center"
        data-aos="fade-down"
      >
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.name?.split(" ")[0] || "User"} 👋
        </h1>
      </header>

      {/* Overview Cards with min height for mobile */}
      <section
        data-aos="fade-up"
        className="bg-white rounded-2xl shadow-lg p-6 min-h-[250px]"
      >
        <OverviewCards bookings={bookings} loading={loading} error={error} />
      </section>

      {/* Map */}
      <section
        className="bg-white rounded-2xl shadow-lg p-6 min-h-[250px]"
        data-aos="fade-up"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          🌍 Your Active Bookings on Map
        </h2>
        <BookingMap bookings={bookings} />
      </section>

      {/* Booking Form */}
      <section
        className="bg-white rounded-2xl shadow-lg p-6"
        data-aos="fade-up"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          📋 Book a New Service
        </h2>
        <BookingForm userEmail={user.email} onNewBooking={fetchBookings} />
      </section>

      {/* Recent Bookings */}
      <section data-aos="fade-up" className="space-y-4 min-h-[250px]">
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
          <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto min-h-[200px]">
            <BookingsTable bookings={bookings} />
          </div>
        )}
      </section>
    </div>
  );
}
