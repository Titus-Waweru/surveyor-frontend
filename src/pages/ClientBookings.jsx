import { useState, useEffect } from "react";
import axios from "axios";
import BookingsTable from "../components/dashboard/BookingsTable";
import BookingForm from "../components/dashboard/BookingForm";
import AOS from "aos";
import "aos/dist/aos.css";
import SurveyMap from "../components/map/SurveyMap";
import "leaflet/dist/leaflet.css";

export default function ClientBookings({ user }) {
  const [bookings, setBookings]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [error,    setError]      = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [lastBookingId, setLastBookingId] = useState(null);

  const [showMap, setShowMap] = useState(() => {
    const saved = localStorage.getItem("showMap");
    return saved === "true";
  });

  /* ---------------- effects ---------------- */
  useEffect(() => {
    AOS.init({ duration: 1000 });
    if (user?.email) fetchBookings();
  }, [user?.email]);

  useEffect(() => {
    localStorage.setItem("showMap", showMap);
  }, [showMap]);

  /* ---------------- data fetchers ---------------- */
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings?userEmail=${encodeURIComponent(
          user.email
        )}`
      );
      setBookings(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------- handle new booking -------------- */
  const handleNewBooking = async (newBookingData) => {
    // Call original fetchBookings to refresh list
    await fetchBookings();

    // Find the newly added booking by matching some criteria
    // (assuming backend returns the created booking or we can rely on latest booking)
    // Here, as a safe bet, pick the booking with the newest createdAt timestamp
    const newestBooking = bookings.reduce((latest, current) => {
      if (!latest) return current;
      return new Date(current.createdAt) > new Date(latest.createdAt)
        ? current
        : latest;
    }, null);

    // Set the lastBookingId for redirect & show modal
    if (newestBooking) {
      setLastBookingId(newestBooking.id);
      setShowModal(true);
    }
  };

  const bookingsWithCoordinates = bookings.filter(
    (b) => b.latitude && b.longitude
  );

  /* ----------- Modal actions ----------- */
  const handlePayNow = () => {
    setShowModal(false);
    if (lastBookingId) {
      // Redirect to payment page with bookingId as query param
      window.location.href = `/payments?bookingId=${lastBookingId}`;
    }
  };

  const handlePayLater = () => {
    setShowModal(false);
  };

  /* ---------------- ui ---------------- */
  return (
    <div className="min-h-screen bg-[#fff6e5] px-4 py-10 font-manrope">
      <div
        className="w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-6 md:p-10"
        data-aos="fade-up"
      >
        {/* title */}
        <h1 className="text-3xl font-bold text-yellow-600 text-center font-poppins mb-8">
          Bookings
        </h1>

        {/* content area */}
        <section>
          {loading ? (
            <p className="text-center text-sm text-gray-600 animate-pulse">
              Loading bookings…
            </p>
          ) : error ? (
            <p className="text-center text-sm text-red-600">{error}</p>
          ) : bookings.length === 0 ? (
            <p className="text-center text-sm text-gray-600">
              You haven’t made any bookings yet. Use the form below to get started.
            </p>
          ) : (
            <>
              {/* map toggle */}
              {bookingsWithCoordinates.length > 0 && (
                <div className="mb-10">
                  <button
                    onClick={() => setShowMap((prev) => !prev)}
                    className="mb-4 w-full sm:w-auto px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    {showMap ? "Hide Map" : "Show Map"}
                  </button>

                  {showMap && (
                    <>
                      <h2 className="text-lg font-semibold text-gray-700 mb-2 font-poppins">
                        Booking Locations
                      </h2>

                      {/* map search */}
                      <input
                        type="text"
                        placeholder="Search location…"
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

              {/* table in its own scroll area */}
              <div className="overflow-x-auto rounded-xl shadow-md">
                {/* give the table room to breathe; if it’s wider than the card, it scrolls  */}
                <div className="min-w-[700px] bg-white rounded-xl">
                  <BookingsTable bookings={bookings} />
                </div>
              </div>

              {/* review button */}
              <div className="text-center mt-6">
                <a
                  href="/review"
                  className="inline-block w-full sm:w-auto px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
                >
                  Leave a Review
                </a>
              </div>
            </>
          )}
        </section>

        {/* divider */}
        <div className="border-t border-gray-300 mt-10 mb-6" />

        {/* booking form */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 font-poppins">
            Create New Booking
          </h2>
          {/* Pass the new handler here */}
          <BookingForm userEmail={user.email} onNewBooking={handleNewBooking} />
        </section>
      </div>

      {/* --- Modal --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4 font-poppins">
              Booking Created!
            </h3>
            <p className="mb-6">Would you like to pay for your booking now?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handlePayLater}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Pay Later
              </button>
              <button
                onClick={handlePayNow}
                className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
