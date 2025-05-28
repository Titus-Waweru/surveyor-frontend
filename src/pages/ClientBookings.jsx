import { useState, useEffect } from "react";
import axios from "axios";
import BookingsTable from "../components/dashboard/BookingsTable";
import BookingForm from "../components/dashboard/BookingForm";
import AOS from "aos";
import "aos/dist/aos.css";
import SurveyMap from "../components/map/SurveyMap";
import "leaflet/dist/leaflet.css"; // Ensure Leaflet styles are loaded

export default function ClientBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/bookings?userEmail=${encodeURIComponent(user.email)}`
);

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
    if (user?.email) fetchBookings();
  }, [user?.email]);

  // Filter out bookings with valid coordinates
  const bookingsWithCoordinates = bookings.filter(
    (b) => b.latitude && b.longitude
  );

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-10 font-manrope">
      <div
        className="w-full max-w-5xl bg-white shadow-xl rounded-3xl p-6 md:p-10"
        data-aos="fade-up"
      >
        {/* Title */}
        <h1 className="text-3xl font-bold text-yellow-600 text-center font-poppins mb-8">
          My Bookings
        </h1>

        {/* Bookings Section */}
        <section>
          {loading ? (
            <p className="text-center text-sm text-gray-600 animate-pulse">
              Loading bookings...
            </p>
          ) : error ? (
            <p className="text-center text-sm text-red-600">{error}</p>
          ) : bookings.length === 0 ? (
            <p className="text-center text-sm text-gray-600">
              You haven’t made any bookings yet. Use the form below to get started.
            </p>
          ) : (
            <>
              {/* Map Section */}
              {bookingsWithCoordinates.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">Booking Locations</h2>
                  <SurveyMap bookings={bookingsWithCoordinates} />
                </div>
              )}

              {/* Table */}
              <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                <BookingsTable bookings={bookings} />
              </div>
            </>
          )}
        </section>

        {/* Divider */}
        <div className="border-t mt-10 mb-6"></div>

        {/* Booking Form */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New Booking</h2>
          <BookingForm userEmail={user.email} onNewBooking={fetchBookings} />
        </section>
      </div>
    </div>
  );
}
