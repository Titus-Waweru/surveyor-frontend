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

      const res = await API.get(
        `/surveyor/dashboard?email=${encodeURIComponent(email)}`
      );
      setSurveyorData(res.data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch surveyor data.");
      setSurveyorData(null);
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
      alert(
        err.response?.data?.message || err.message || "Failed to update booking."
      );
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
    <div className="min-h-screen bg-[#fff6e5] py-12 px-4 font-manrope flex justify-center items-start">
      <div
        className="w-full max-w-7xl bg-white shadow-xl rounded-3xl p-8 md:p-12"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold font-poppins text-blue-700 text-center mb-8">
          Welcome, {surveyorData.surveyorName}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Assigned Jobs" value={surveyorData.totalAssigned} color="blue" />
          <StatCard title="Completed" value={surveyorData.completedCount} color="green" />
          <StatCard title="Pending" value={surveyorData.pendingCount} color="yellow" />
        </div>

        {/* Map Toggle */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowMap((prev) => !prev)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-all"
          >
            {showMap ? "Hide Map" : "Show Map"}
          </button>
        </div>

        {/* Booking Table */}
        <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Survey Type</th>
                <th className="px-4 py-3">Preferred Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {surveyorData.recentBookings?.map((booking, i) => (
                <React.Fragment key={booking.id}>
                  <tr>
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3">{booking.location}</td>
                    <td className="px-4 py-3">{booking.surveyType}</td>
                    <td className="px-4 py-3">
                      {new Date(booking.preferredDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : booking.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      {(booking.status === "pending" || booking.status === "rejected") && (
                        <>
                          <button
                            disabled={updatingBookingId === booking.id}
                            onClick={() =>
                              updateBookingStatus(booking.id, { action: "accept" })
                            }
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            Accept
                          </button>
                          <button
                            disabled={updatingBookingId === booking.id}
                            onClick={() =>
                              updateBookingStatus(booking.id, { action: "reject" })
                            }
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
                            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                      <td colSpan="6" className="px-4 py-3">
                        <BookingMap latitude={booking.latitude} longitude={booking.longitude} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
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
