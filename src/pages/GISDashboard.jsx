import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import API from "../utils/axios";
import BookingMap from "../components/dashboard/BookingMap";

export default function GISDashboard() {
  const [gisData, setGisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingAssignmentId, setUpdatingAssignmentId] = useState(null);

  // Map toggle state with localStorage persistence
  const [showMap, setShowMap] = useState(() => {
    const saved = localStorage.getItem("gisShowMap");
    return saved === "true";
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchGisData();
  }, []);

  useEffect(() => {
    localStorage.setItem("gisShowMap", showMap);
  }, [showMap]);

  const fetchGisData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;
      if (!email) throw new Error("User email not found. Please log in.");

      const res = await API.get(`/gis/dashboard?email=${encodeURIComponent(email)}`);
      setGisData(res.data);
    } catch (err) {
      setError(err.message || "Failed to fetch GIS Expert data.");
    } finally {
      setLoading(false);
    }
  };

  const updateAssignmentStatus = async (assignmentId, payload) => {
    setUpdatingAssignmentId(assignmentId);
    try {
      await API.patch(`/gis/assignments/${assignmentId}/status`, payload);
      await fetchGisData();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to update assignment.");
    } finally {
      setUpdatingAssignmentId(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center font-manrope">
        Loading GIS dashboard...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center text-red-600 font-manrope">
        {error}
      </div>
    );
  if (!gisData)
    return (
      <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center font-manrope">
        No GIS data found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-3xl p-10 md:p-14" data-aos="fade-up">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6 font-poppins">
          Welcome, {gisData.gisExpertName}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 font-manrope">
          <StatCard title="Assigned Jobs" value={gisData.totalAssigned} color="blue" />
          <StatCard title="Completed" value={gisData.completedCount} color="green" />
          <StatCard title="Pending" value={gisData.pendingCount} color="yellow" />
        </div>

        <div className="bg-white rounded-xl shadow p-6 font-manrope">
          <h2 className="text-xl font-semibold mb-3 text-indigo-700">Recent GIS Assignments</h2>

          {/* Map toggle button */}
          <button
            onClick={() => setShowMap((prev) => !prev)}
            className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-manrope"
          >
            {showMap ? "Hide Map" : "Show Map"}
          </button>

          {gisData.recentAssignments?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-2 px-4">#</th>
                    <th className="py-2 px-4">Location</th>
                    <th className="py-2 px-4">Task Type</th>
                    <th className="py-2 px-4">Due Date</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gisData.recentAssignments.map((job, i) => (
                    <React.Fragment key={job.id}>
                      <tr className="border-b">
                        <td className="py-2 px-4">{i + 1}</td>
                        <td className="py-2 px-4">{job.location}</td>
                        <td className="py-2 px-4">{job.taskType}</td>
                        <td className="py-2 px-4">
                          {new Date(job.dueDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-2 px-4 capitalize">{job.status}</td>
                        <td className="py-2 px-4 space-x-2">
                          {(job.status === "pending" || job.status === "rejected") && (
                            <>
                              <button
                                disabled={updatingAssignmentId === job.id}
                                onClick={() => updateAssignmentStatus(job.id, { action: "accept" })}
                                className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                              >
                                Accept
                              </button>
                              <button
                                disabled={updatingAssignmentId === job.id}
                                onClick={() => updateAssignmentStatus(job.id, { action: "reject" })}
                                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {job.status !== "completed" && job.status !== "pending" && job.status !== "rejected" && (
                            <select
                              disabled={updatingAssignmentId === job.id}
                              value={job.status}
                              onChange={(e) => updateAssignmentStatus(job.id, { status: e.target.value })}
                              className="border rounded px-2 py-1"
                            >
                              <option value="accepted">Accepted</option>
                              <option value="in progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          )}
                        </td>
                      </tr>

                      {/* Map row if coordinates exist and showMap is true */}
                      {showMap && job.latitude && job.longitude && (
                        <tr>
                          <td colSpan="6" className="py-4">
                            <BookingMap latitude={job.latitude} longitude={job.longitude} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No recent assignments.</p>
          )}
        </div>
      </div>
    </div>
  );
}

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
