import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/dashboard/Layout.jsx";

export default function AdminDashboard({ user, setUser }) {
  const [bookings, setBookings] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL;

  const handleLogout = () => setUser(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const bookingsRes = await axios.get(`${API_BASE}/bookings/all`);
        const usersRes = await axios.get(`${API_BASE}/users/surveyors`);
        setBookings(bookingsRes.data);
        setSurveyors(usersRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [API_BASE]);

  const handleAssign = async (bookingId, surveyorId) => {
    try {
      await axios.patch(`${API_BASE}/bookings/${bookingId}/assign`, {
        surveyorId,
      });
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, assignedSurveyorId: surveyorId } : b
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to assign surveyor.");
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout}>
      <h1 className="text-2xl font-bold mb-6 font-poppins">Admin Dashboard</h1>

      {loading ? (
        <p className="text-gray-600 font-manrope">Loading bookings...</p>
      ) : error ? (
        <p className="text-red-600 font-manrope">{error}</p>
      ) : (
        <div className="grid gap-4 font-manrope">
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
