import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import API from "../utils/axios";
import BookingMap from "../components/dashboard/BookingMap";

const SurveyorDashboard = () => {
  const [surveyorData, setSurveyorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  // Map toggle state with localStorage persistence
  const [showMap, setShowMap] = useState(() => {
    const saved = localStorage.getItem("showMap");
    return saved === "true";
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchSurveyorData();
  }, []);

  useEffect(() => {
    localStorage.setItem("showMap", showMap);
  }, [showMap]);

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
      <div className="min-h-screen bg-[#fff6e5] flex items-start pt-20 font-manrope">
        <div className="w-full max-w-6xl mx-auto px-6 text-center">Loading surveyor dashboard...</div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-[#fff6e5] flex items-start pt-20 font-manrope">
        <div className="w-full max-w-6xl mx-auto px-6 text-center text-red-600">{error}</div>
      </div>
    );
  if (!surveyorData)
    return (
      <div className="min-h-screen bg-[#fff6e5] flex items-start pt-20 font-manrope">
        <div className="w-full max-w-6xl mx-auto px-6 text-center">No surveyor data found.</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fff6e5] font-manrope pt-20 pb-12 px-6">
      <div
        className="w-full max-w-6xl bg-white shadow-xl rounded-3xl p-10 md:p-14 mx-auto"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-8 font-poppins">
          Welcome, {surveyorData.surveyorName}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <StatCard title="Assigned Jobs" value={surveyorData.totalAssigned} color="blue" />
          <StatCard title="Completed" value={surveyorData.completedCount} color="green" />
          <StatCard title="Pending" value={surveyorData.pendingCount} color="yellow" />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">Recent Bookings</h2>

          <button
            onClick={() => setShowMap((prev) => !prev)}
            className="mb-6 px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition font-manrope"
          >
            {showMap ? "Hide Map" : "Show Map"}
          </button>

          {surveyorData.recentBookings?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-3 px-5">#</th>
                    <th className="py-3 px-5">Location</th>
                    <th className="py-3 px-5">Survey Type</th>
                    <th className="py-3 px-5">Preferred Date</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {surveyorData.recentBookings.map((booking, i) => (
                    <React.Fragment key={booking.id}>
                      <tr className="border-b">
                        <td className="py-3 px-5">{i + 1}</td>
                        <td className="py-3 px-5">{booking.location}</td>
                        <td className="py-3 px-5">{booking.surveyType}</td>
                        <td className="py-3 px-5">
                          {new Date(booking.preferredDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-5 capitalize">{booking.status}</td>
                        <td className="py-3 px-5 space-x-2">
                          {(booking.status === "pending" || booking.status === "rejected") && (
                            <>
                              <button
                                disabled={updatingBookingId === booking.id}
                                onClick={() => updateBookingStatus(booking.id, { action: "accept" })}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                              >
                                Accept
                              </button>
                              <button
                                disabled={updatingBookingId === booking.id}
                                onClick={() => updateBookingStatus(booking.id, { action: "reject" })}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {booking.status !== "pending" &&
                            booking.status !== "rejected" &&
                            booking.status !== "completed" && (
                              <select
                                disabled={updatingBookingId === booking.id}
                                value={booking.status}
                                onChange={(e) =>
                                  updateBookingStatus(booking.id, { status: e.target.value })
                                }
                                className="border rounded px-3 py-1"
                              >
                                <option value="accepted">Accepted</option>
                                <option value="in progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>
                            )}
                        </td>
                      </tr>

                      {showMap && booking.latitude && booking.longitude && (
                        <tr>
                          <td colSpan="6" className="py-6">
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
