import { useState, useEffect } from "react";
import axios from "axios";
import BookingsTable from "../components/dashboard/BookingsTable";
import BookingForm from "../components/dashboard/BookingForm";
import AOS from "aos";
import "aos/dist/aos.css";
import SurveyMap from "../components/map/SurveyMap";
import "leaflet/dist/leaflet.css";

export default function ClientBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="min-h-screen bg-[#fff6e5] flex flex-col items-center px-4 py-10 font-manrope">
      <div
        className="w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl bg-white shadow-xl rounded-3xl p-6 md:p-10"
        data-aos="fade-up"
      >
        {/* Title */}
        <h1 className="text-3xl font-bold text-yellow-600 text-center font-poppins mb-8">
          <strong>Bookings</strong>
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
              {/* Map Toggle */}
              {bookingsWithCoordinates.length > 0 && (
                <div className="mb-10">
                  <button
                    onClick={() => setShowMap((prev) => !prev)}
                    className="mb-4 w-full sm:w-auto px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    {showMap ? "Hide Map" : "Show Map"}
                  </button>

                  {/* Conditionally render map */}
                  {showMap && (
                    <>
                      <h2 className="text-lg font-semibold text-gray-700 mb-2 font-poppins">
                        <strong>Booking Locations</strong>
                      </h2>

                      {/* Search bar for map */}
                      <input
                        type="text"
                        placeholder="Search location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-1/2 mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                      />

                      <div className="w-full h-64 sm:h-80 md:h-96">
                        <SurveyMap
                          bookings={bookingsWithCoordinates}
                          searchQuery={searchQuery}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Table + Review Button */}
              <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                <BookingsTable bookings={bookings} />
              </div>

              {/* Leave a Review Button */}
              <div className="text-center mt-6">
                <a
                  href="/client/review"
                  className="inline-block w-full sm:w-auto px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
                >
                  Leave a Review
                </a>
              </div>
            </>
          )}
        </section>

        {/* Divider */}
        <div className="border-t border-gray-300 mt-10 mb-6"></div>

        {/* Booking Form */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 font-poppins">
            <strong>Create New Booking</strong>
          </h2>
          <BookingForm userEmail={user.email} onNewBooking={fetchBookings} />
        </section>
      </div>
    </div>
  );
}
