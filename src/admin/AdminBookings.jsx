import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import BookingMap from "../components/dashboard/BookingMap";

const API = import.meta.env.VITE_API_URL;

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [status, setStatus] = useState("");

  // 👇 New: Role selection (surveyor or gis-expert)
  const [selectedRole, setSelectedRole] = useState("surveyor");

  const [showMaps, setShowMaps] = useState(() => {
    const saved = localStorage.getItem("adminShowMaps");
    return saved === "true";
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchBookings();
  }, []);

  useEffect(() => {
    localStorage.setItem("adminShowMaps", showMaps);
  }, [showMaps]);

  useEffect(() => {
    fetchSurveyors();
  }, [selectedRole]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API}/admin/bookings/all`);
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setStatus("Failed to load bookings.");
    }
  };

  // 👇 New: Fetch either surveyors or GIS experts
  const fetchSurveyors = async () => {
    try {
      const endpoint =
        selectedRole === "gis-expert"
          ? "users/gis-experts"
          : "users/surveyors";
      const res = await axios.get(`${API}/admin/${endpoint}`);
      setSurveyors(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleAssign = async (bookingId, surveyorId) => {
    try {
      await axios.patch(`${API}/admin/bookings/${bookingId}/assign`, {
        surveyorId,
      });
      fetchBookings();
    } catch (err) {
      console.error("Assignment error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] py-12 px-4 font-manrope flex justify-center items-start">
      <div
        className="w-full max-w-7xl bg-white shadow-xl rounded-3xl p-8 md:p-12"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold font-poppins text-yellow-600 text-center mb-8">
          All Bookings
        </h1>

        {status && (
          <p className="text-red-500 text-sm mb-4 text-center">{status}</p>
        )}

        {/* ✅ Map toggle */}
        <div className="text-center mb-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <button
            onClick={() => setShowMaps((prev) => !prev)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-all"
          >
            {showMaps ? "Hide Maps" : "Show Maps"}
          </button>

          {/* ✅ Role selector */}
          <div className="text-sm">
            <label className="mr-2 font-medium">Assign role:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="surveyor">Surveyor</option>
              <option value="gis-expert">GIS Expert</option>
            </select>
          </div>
        </div>

        {/* ✅ Table */}
        <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Survey Type</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Preferred Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assign {selectedRole === "gis-expert" ? "GIS Expert" : "Surveyor"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((b) => (
                <Fragment key={b.id}>
                  <tr>
                    <td className="px-4 py-3">{b.user?.name || "N/A"}</td>
                    <td className="px-4 py-3">{b.surveyType}</td>
                    <td className="px-4 py-3">{b.location}</td>
                    <td className="px-4 py-3">
                      {new Date(b.preferredDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          b.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : b.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={b.assignedSurveyorId || ""}
                        onChange={(e) =>
                          handleAssign(b.id, parseInt(e.target.value))
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
                    <tr>
                      <td colSpan="6" className="px-4 py-3">
                        <BookingMap
                          latitude={b.latitude}
                          longitude={b.longitude}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
