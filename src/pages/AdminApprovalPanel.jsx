// src/pages/AdminApprovalPanel.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/dashboard/Layout.jsx";

export default function AdminApprovalPanel({ user, setUser }) {
  const [surveyors, setSurveyors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => setUser(null);

  useEffect(() => {
    async function fetchPending() {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/admin/pending-surveyors");
        setSurveyors(res.data);
      } catch (err) {
        setError("Failed to load surveyors.");
      } finally {
        setLoading(false);
      }
    }
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    await axios.patch(`http://localhost:5000/api/admin/approve/${id}`);
    setSurveyors(surveyors.filter((s) => s.id !== id));
  };

  const handleReject = async (id) => {
    await axios.patch(`http://localhost:5000/api/admin/reject/${id}`);
    setSurveyors(surveyors.filter((s) => s.id !== id));
  };

  return (
    <Layout user={user} onLogout={handleLogout}>
      <h1 className="text-2xl font-bold mb-6">Pending Surveyor Approvals</h1>

      {loading ? (
        <p>Loading surveyors...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : surveyors.length === 0 ? (
        <p>No pending surveyors.</p>
      ) : (
        <div className="grid gap-4">
          {surveyors.map((s) => (
            <div key={s.id} className="bg-white border rounded p-4 shadow">
              <p><strong>Name:</strong> {s.name}</p>
              <p><strong>Email:</strong> {s.email}</p>
              <p><strong>ISK No:</strong> {s.iskNumber}</p>
              <p className="mt-2">
                <a
                  className="text-blue-600 hover:underline mr-4"
                  href={`http://localhost:5000${s.idCardUrl}`}
                  target="_blank"
                >
                  View ID Card
                </a>
                <a
                  className="text-blue-600 hover:underline"
                  href={`http://localhost:5000${s.certUrl}`}
                  target="_blank"
                >
                  View Certificate
                </a>
              </p>
              <div className="mt-4 space-x-4">
                <button
                  className="bg-green-600 text-white px-4 py-1 rounded"
                  onClick={() => handleApprove(s.id)}
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-1 rounded"
                  onClick={() => handleReject(s.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
