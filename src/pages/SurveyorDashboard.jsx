import React, { useState, useEffect } from "react";

const SurveyorDashboard = () => {
  const [surveyorData, setSurveyorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  const fetchSurveyorData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user")); // adjust as needed
      const email = user?.email;

      if (!email) {
        throw new Error("User email not found. Please log in.");
      }

      const url = `/api/surveyor/dashboard?email=${encodeURIComponent(email)}`;

      const response = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }

      const data = await response.json();
      setSurveyorData(data);
    } catch (err) {
      setError(err.message || "Failed to fetch surveyor data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyorData();
  }, []);

  const updateBookingStatus = async (bookingId, payload) => {
    setUpdatingBookingId(bookingId);
    try {
      const response = await fetch(`/api/surveyor/bookings/${bookingId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to update booking: ${errorBody}`);
      }

      // Refresh dashboard data after update
      await fetchSurveyorData();
    } catch (err) {
      alert(err.message || "Failed to update booking.");
    } finally {
      setUpdatingBookingId(null);
    }
  };

  if (loading) return <div className="p-6">Loading surveyor dashboard...</div>;
  if (error) return <div className="text-red-600 p-6">Error: {error}</div>;
  if (!surveyorData) return <div className="p-6">No surveyor data found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {surveyorData.surveyorName}
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Assigned Jobs" value={surveyorData.totalAssigned} color="bg-blue-600" />
        <StatCard title="Completed" value={surveyorData.completedCount} color="bg-green-600" />
        <StatCard title="Pending" value={surveyorData.pendingCount} color="bg-yellow-500" />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-semibold mb-3">Recent Bookings</h2>
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
                  <tr key={booking.id} className="border-b">
                    <td className="py-2 px-4">{i + 1}</td>
                    <td className="py-2 px-4">{booking.location}</td>
                    <td className="py-2 px-4">{booking.surveyType}</td>
                    <td className="py-2 px-4">
                      {new Date(booking.preferredDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 capitalize">{booking.status}</td>
                    <td className="py-2 px-4 space-x-2">
                      {/* Show accept/reject buttons only if status is neither accepted nor rejected */}
                      {(booking.status === "pending" || booking.status === "rejected") && (
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
                      )}

                      {/* If accepted, show status update dropdown */}
                      {booking.status === "accepted" && (
                        <select
                          disabled={updatingBookingId === booking.id}
                          value={booking.statusDetail || "pending"}
                          onChange={(e) =>
                            updateBookingStatus(booking.id, { status: e.target.value })
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="in progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      )}

                      {/* If status is 'in progress' or 'completed' allow status updates as well */}
                      {(booking.status === "in progress" || booking.status === "completed") && (
                        <select
                          disabled={updatingBookingId === booking.id}
                          value={booking.status}
                          onChange={(e) =>
                            updateBookingStatus(booking.id, { status: e.target.value })
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="in progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No recent bookings available.</p>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`rounded-xl p-4 text-white shadow ${color}`}>
    <h3 className="text-lg">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default SurveyorDashboard;
