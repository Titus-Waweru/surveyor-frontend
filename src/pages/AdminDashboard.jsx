// src/pages/AdminDashboard.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/dashboard/Layout.jsx";

export default function AdminDashboard({ user, setUser }) {
  const [bookings, setBookings] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => setUser(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const bookingsRes = await axios.get("http://localhost:5000/api/bookings/all");
        const usersRes = await axios.get("http://localhost:5000/api/users/surveyors");
        setBookings(bookingsRes.data);
        setSurveyors(usersRes.data);
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAssign = async (bookingId, surveyorId) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/assign`, {
        surveyorId,
      });
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, assignedSurveyorId: surveyorId } : b
        )
      );
    } catch (err) {
      alert("Failed to assign surveyor.");
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout}>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white border p-4 rounded shadow">
              <h3 className="font-semibold">
                {b.surveyType} at {b.location}
              </h3>
              <p className="text-sm text-gray-600">{b.description}</p>
              <p className="text-sm mt-1">Status: {b.status}</p>
              <p className="text-sm">Client: {b.user?.email}</p>
              <div className="mt-3">
                <label className="mr-2 text-sm">Assign Surveyor:</label>
                <select
                  className="border rounded px-2 py-1"
                  value={b.assignedSurveyorId || ""}
                  onChange={(e) => handleAssign(b.id, parseInt(e.target.value))}
                >
                  <option value="">-- Select --</option>
                  {surveyors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
