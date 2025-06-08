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
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 Search bar state

  const [showMap, setShowMap] = useState(() => {
    const saved = localStorage.getItem("showMap");
    return saved === "true";
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
    if (user?.email) fetchBookings();
  }, [user?.email]);

  useEffect(() => {
    localStorage.setItem("showMap", showMap);
  }, [showMap]);

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
          <strong><b>Bookings</b></strong>
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
              {/* ✅ Map Toggle */}
              {bookingsWithCoordinates.length > 0 && (
                <div className="mb-10">
                  <button
                    onClick={() => setShowMap((prev) => !prev)}
                    className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    {showMap ? "Hide Map" : "Show Map"}
                  </button>

                  {/* ✅ Conditionally render map */}
                  {showMap && (
                    <>
                      <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        <strong>Booking Locations</strong>
                      </h2>

                      {/* 🔍 Search bar for map */}
                      <input
                        type="text"
                        placeholder="Search location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-1/2 mb-4 px-4 py-2 border rounded focus:outline-none focus:ring focus:border-yellow-400"
                      />

                      <SurveyMap
                        bookings={bookingsWithCoordinates}
                        searchQuery={searchQuery} // 👈 Pass to map component
                      />
                    </>
                  )}
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
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            <b>Create New Booking</b>
          </h2>
          <BookingForm userEmail={user.email} onNewBooking={fetchBookings} />
        </section>
      </div>
    </div>
  );
}
