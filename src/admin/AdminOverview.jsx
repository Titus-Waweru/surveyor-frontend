import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AdminOverview() {
  const [pendingSurveyors, setPendingSurveyors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, bookingsRes, surveyorsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/pending-surveyors"),
        axios.get("http://localhost:5000/api/admin/bookings/all"),
        axios.get("http://localhost:5000/api/admin/users/surveyors"),
      ]);
      setPendingSurveyors(pendingRes.data);
      setBookings(bookingsRes.data);
      setSurveyors(surveyorsRes.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, action) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/${action}/${id}`);
      fetchData();
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  const handleAssignment = async (bookingId, surveyorId) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/bookings/${bookingId}/assign`, {
        surveyorId,
      });
      fetchData();
    } catch (err) {
      console.error("Assignment error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-10 font-manrope">
      <div
        className="w-full max-w-6xl bg-white shadow-xl rounded-3xl p-10 md:p-14"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold text-yellow-600 text-center mb-8 font-poppins">
          <strong>Admin Overview</strong>
        </h1>

        {loading ? (
          <p className="text-center text-sm text-gray-600">Loading dashboard data...</p>
        ) : (
          <>
            {/* Pending Surveyors */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-5 text-gray-800">Pending Surveyor Approvals</h2>
              {pendingSurveyors.length === 0 ? (
                <p className="text-gray-500">No pending surveyors.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border shadow-sm">
                  <table className="min-w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-700 font-semibold">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">ISK</th>
                        <th className="px-4 py-3">ID Card</th>
                        <th className="px-4 py-3">Certificate</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pendingSurveyors.map((s) => (
                        <tr key={s.id}>
                          <td className="px-4 py-3">{s.name}</td>
                          <td className="px-4 py-3">{s.email}</td>
                          <td className="px-4 py-3">{s.iskNumber}</td>
                          <td className="px-4 py-3">
                            <a href={`http://localhost:5000${s.idCardUrl}`} target="_blank" rel="noreferrer" className="text-indigo-600 underline">View</a>
                          </td>
                          <td className="px-4 py-3">
                            <a href={`http://localhost:5000${s.certUrl}`} target="_blank" rel="noreferrer" className="text-indigo-600 underline">View</a>
                          </td>
                          <td className="px-4 py-3 space-x-2">
                            <button onClick={() => handleApproval(s.id, "approve")} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md transition">Approve</button>
                            <button onClick={() => handleApproval(s.id, "reject")} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md transition">Reject</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Bookings */}
            <section>
              <h2 className="text-2xl font-semibold mb-5 text-gray-800">All Bookings from Customers</h2>
              {bookings.length === 0 ? (
                <p className="text-gray-500">No bookings found.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border shadow-sm">
                  <table className="min-w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-700 font-semibold">
                      <tr>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Assign Surveyor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bookings.map((b) => (
                        <tr key={b.id}>
                          <td className="px-4 py-3">{b.user?.name || "N/A"}</td>
                          <td className="px-4 py-3">{b.surveyType}</td>
                          <td className="px-4 py-3">{b.location}</td>
                          <td className="px-4 py-3">{b.status}</td>
                          <td className="px-4 py-3">
                            <select
                              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              value={b.assignedSurveyorId || ""}
                              onChange={(e) => handleAssignment(b.id, parseInt(e.target.value))}
                            >
                              <option value="">-- Select --</option>
                              {surveyors.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
