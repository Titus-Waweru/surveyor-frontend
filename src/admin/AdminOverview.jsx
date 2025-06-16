import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import BookingMap from "../components/dashboard/BookingMap";

const API = import.meta.env.VITE_API_URL;

export default function AdminOverview() {
  const [pendingSurveyors, setPendingSurveyors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMaps, setShowMaps] = useState(
    localStorage.getItem("adminShowMaps") === "false" ? false : true
  );

  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, bookingsRes, surveyorsRes] = await Promise.all([
        axios.get(`${API}/admin/pending-surveyors`),
        axios.get(`${API}/admin/bookings/all`),
        axios.get(`${API}/admin/users/surveyors`),
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
      await axios.patch(`${API}/admin/${action}/${id}`);
      fetchData();
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  const handleAssignment = async (bookingId, surveyorId) => {
    try {
      await axios.patch(`${API}/admin/bookings/${bookingId}/assign`, {
        surveyorId,
      });
      fetchData();
    } catch (err) {
      console.error("Assignment error:", err);
    }
  };

  const toggleShowMaps = () => {
    const newValue = !showMaps;
    setShowMaps(newValue);
    localStorage.setItem("adminShowMaps", newValue);
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] px-4 py-10 flex items-start justify-center font-manrope">
      <div
        className="w-full max-w-6xl bg-white shadow-xl rounded-3xl p-2 md:p-3"
        data-aos="fade-up"
      >
        <h1 className="text-2xl font-bold text-yellow-600 text-center mb-6 font-poppins">
          Admin Dashboard Overview
        </h1>

        {loading ? (
          <p className="text-center text-sm text-gray-600">
            Loading dashboard data...
          </p>
        ) : (
          <>
            {/* Pending Surveyors */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Pending Surveyor Approvals
              </h2>
              {pendingSurveyors.length === 0 ? (
                <p className="text-gray-500">No pending surveyors.</p>
              ) : (
                <div className="overflow-x-auto border rounded-xl shadow-sm">
                  <table className="min-w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-700 font-semibold">
                      <tr>
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Email</th>
                        <th className="px-3 py-2">ISK Number</th>
                        <th className="px-3 py-2">ID Card</th>
                        <th className="px-3 py-2">Certificate</th>
                        <th className="px-3 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pendingSurveyors.map((s) => (
                        <tr key={s.id}>
                          <td className="px-3 py-2">{s.name}</td>
                          <td className="px-3 py-2">{s.email}</td>
                          <td className="px-3 py-2">{s.iskNumber}</td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() => {
                                setPreviewUrl(s.idCardUrl);
                                setPreviewType(
                                  s.idCardUrl.endsWith(".pdf")
                                    ? "pdf"
                                    : "image"
                                );
                              }}
                              className="text-indigo-600 underline hover:text-indigo-800"
                            >
                              View
                            </button>
                          </td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() => {
                                setPreviewUrl(s.certUrl);
                                setPreviewType(
                                  s.certUrl.endsWith(".pdf")
                                    ? "pdf"
                                    : "image"
                                );
                              }}
                              className="text-indigo-600 underline hover:text-indigo-800"
                            >
                              View
                            </button>
                          </td>
                          <td className="px-3 py-2 space-x-2">
                            <button
                              onClick={() => handleApproval(s.id, "approve")}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleApproval(s.id, "reject")}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                            >
                              Reject
                            </button>
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
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                All Bookings from Clients
              </h2>

              <div className="flex justify-end mb-3">
                <button
                  onClick={toggleShowMaps}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1.5 rounded-md font-semibold"
                >
                  {showMaps ? "Hide Maps" : "Show Maps"}
                </button>
              </div>

              {bookings.length === 0 ? (
                <p className="text-gray-500">No bookings found.</p>
              ) : (
                <div className="overflow-x-auto border rounded-xl shadow-sm">
                  <table className="min-w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-700 font-semibold">
                      <tr>
                        <th className="px-3 py-2">Client</th>
                        <th className="px-3 py-2">Survey Type</th>
                        <th className="px-3 py-2">Location</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Assign Surveyor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bookings.map((b) => (
                        <>
                          <tr key={b.id}>
                            <td className="px-3 py-2">
                              {b.user?.name || "N/A"}
                            </td>
                            <td className="px-3 py-2">{b.surveyType}</td>
                            <td className="px-3 py-2">{b.location}</td>
                            <td className="px-3 py-2 capitalize">{b.status}</td>
                            <td className="px-3 py-2">
                              <select
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                value={b.assignedSurveyorId || ""}
                                onChange={(e) =>
                                  handleAssignment(
                                    b.id,
                                    parseInt(e.target.value)
                                  )
                                }
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

                          {showMaps && b.latitude && b.longitude && (
                            <tr key={`map-${b.id}`}>
                              <td colSpan="5" className="px-3 py-2">
                                <BookingMap
                                  latitude={b.latitude}
                                  longitude={b.longitude}
                                />
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* Document Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white p-4 rounded-xl shadow-lg max-w-3xl w-full relative">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-3">Document Preview</h3>
            {previewType === "pdf" ? (
              <iframe
                src={previewUrl}
                title="Document Preview"
                className="w-full h-[500px] rounded-md"
              ></iframe>
            ) : (
              <img
                src={previewUrl}
                alt="Document Preview"
                className="max-w-full max-h-[500px] mx-auto rounded-md"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
