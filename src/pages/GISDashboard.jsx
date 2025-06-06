import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import API from "../utils/axios";

export default function GISDashboard() {
  const [gisData, setGisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchGisData();
  }, []);

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

  if (loading)
    return <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center font-manrope">Loading GIS dashboard...</div>;
  if (error)
    return <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center text-red-600 font-manrope">{error}</div>;
  if (!gisData)
    return <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center font-manrope">No GIS data found.</div>;

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
          {gisData.recentAssignments?.length > 0 ? (
            <ul className="space-y-3">
              {gisData.recentAssignments.map((job, index) => (
                <li key={job.id} className="p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-700">
                    <strong>Location:</strong> {job.location}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Task:</strong> {job.taskType}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Status:</strong> <span className="capitalize">{job.status}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Due:</strong>{" "}
                    {new Date(job.dueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </li>
              ))}
            </ul>
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
