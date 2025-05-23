// src/pages/ClientBookings.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import BookingsTable from "../components/dashboard/BookingsTable";
import BookingForm from "../components/dashboard/BookingForm";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ClientBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings?userEmail=${user.email}`);
      setBookings(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchBookings();
  }, [user.email]);

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-5xl bg-white shadow-xl rounded-3xl p-10 md:p-14"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold text-yellow-600 mb-6 text-center font-poppins">
          My Bookings
        </h1>

        {loading ? (
          <p className="text-center text-sm text-gray-600 font-manrope">Loading bookings...</p>
        ) : error ? (
          <p className="text-center text-sm text-red-600 font-manrope">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-sm text-gray-600 font-manrope">
            No bookings yet. Use the form below to request a survey.
          </p>
        ) : (
          <div className="font-manrope">
            <BookingsTable bookings={bookings} />
          </div>
        )}

        <h2 className="text-xl font-semibold mt-10 mb-4 text-gray-700 font-manrope">
          Create New Booking
        </h2>
        <BookingForm userEmail={user.email} onNewBooking={fetchBookings} />
      </div>
    </div>
  );
}
