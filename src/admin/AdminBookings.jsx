import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const API = import.meta.env.VITE_API_URL;
const BASE = API.replace("/api", ""); // For future use if needed

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingRes, surveyorRes] = await Promise.all([
        axios.get(`${API}/admin/bookings/all`),
        axios.get(`${API}/admin/users/surveyors`),
      ]);
      setBookings(bookingRes.data);
      setSurveyors(surveyorRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setStatus("Failed to load bookings.");
    }
  };

  const handleAssign = async (bookingId, surveyorId) => {
    try {
      await axios.patch(`${API}/admin/bookings/${bookingId}/assign`, {
        surveyorId,
      });
      fetchData();
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

        <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Survey Type</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Preferred Date</th>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
