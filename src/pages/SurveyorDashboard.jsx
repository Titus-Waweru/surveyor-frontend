import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import API from "../utils/axios";
import BookingMap from "../components/dashboard/BookingMap"; // ✅ Import map

const SurveyorDashboard = () => {
  const [surveyorData, setSurveyorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  // NEW: state to toggle map visibility
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchSurveyorData();
  }, []);

  const fetchSurveyorData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;
      if (!email) throw new Error("User email not found. Please log in.");

      const res = await API.get(`/surveyor/dashboard?email=${encodeURIComponent(email)}`);
      setSurveyorData(res.data);
    } catch (err) {
      setError(err.message || "Failed to fetch surveyor data.");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, payload) => {
    setUpdatingBookingId(bookingId);
    try {
      await API.patch(`/surveyor/bookings/${bookingId}/status`, payload);
      await fetchSurveyorData();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to update booking.");
    } finally {
      setUpdatingBookingId(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center font-manrope">
        Loading surveyor dashboard...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center text-red-600 font-manrope">
        {error}
      </div>
    );
  if (!surveyorData)
    return (
      <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center font-manrope">
        No surveyor data found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-3xl p-10 md:p-14" data-aos="fade-up">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6 font-poppins">
          Welcome, {surveyorData.surveyorName}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 font-manrope">
          <StatCard title="Assigned Jobs" value={surveyorData.totalAssigned} color="blue" />
          <StatCard title="Completed" value={surveyorData.completedCount} color="green" />
          <StatCard title="Pending" value={surveyorData.pendingCount} color="yellow" />
        </div>

        <div className="bg-white rounded-xl shadow p-6 font-manrope">
          <h2 className="text-xl font-semibold mb-3 text-indigo-700 flex justify-between items-center">
            Recent Bookings

            {/* Toggle button to show/hide maps */}
            <button
              onClick={() => setShowMap(!showMap)}
              className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition"
              aria-label="Toggle map visibility"
            >
              {showMap ? "Hide Maps" : "Show Maps"}
            </button>
          </h2>

          {surveyorData.recentBookings?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-2 px-4">#</th>
                    <th className="py-2 px-4">Location</th>
                    <th className="py-2 px-4">Survey Type</th>
                    <th className="py-2 px-4">Preferred Date</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {surveyorData.recentBookings.map((booking, i) => (
                    <React.Fragment key={booking.id}>
                      <tr className="border-b">
                        <td className="py-2 px-4">{i + 1}</td>
                        <td className="py-2 px-4">{booking.location}</td>
                        <td className="py-2 px-4">{booking.surveyType}</td>
                        <td className="py-2 px-4">
                          {new Date(booking.preferredDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-2 px-4 capitalize">{booking.status}</td>
                        <td className="py-2 px-4 space-x-2">
                          {booking.status === "pending" || booking.status === "rejected" ? (
                            <>
                              <button
                                disabled={updatingBookingId === booking.id}
                                onClick={() => updateBookingStatus(booking.id, { action: "accept" })}
                                className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                              >
                                Accept
                              </button>
                              <button
                                disabled={updatingBookingId === booking.id}
                                onClick={() => updateBookingStatus(booking.id, { action: "reject" })}
                                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          ) : booking.status !== "completed" ? (
                            <select
                              disabled={updatingBookingId === booking.id}
                              value={booking.status}
                              onChange={(e) => updateBookingStatus(booking.id, { status: e.target.value })}
                              className="border rounded px-2 py-1"
                            >
                              <option value="accepted">Accepted</option>
                              <option value="in progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          ) : null}
                        </td>
                      </tr>

                      {/* Conditionally render map based on showMap state */}
                      {showMap && booking.latitude && booking.longitude && (
                        <tr>
                          <td colSpan="6" className="py-4">
                            <BookingMap latitude={booking.latitude} longitude={booking.longitude} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No recent bookings available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => {
  const colorMap = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className={`p-6 rounded-xl shadow text-center ${colorMap[color]}`}>
      <h3 className="text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default SurveyorDashboard;
