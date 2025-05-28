import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const baseUrl = import.meta.env.VITE_API_URL;

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
        axios.get(`${baseUrl}/admin/bookings/all`),
        axios.get(`${baseUrl}/admin/users/surveyors`),
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
      await axios.patch(`${baseUrl}/admin/bookings/${bookingId}/assign`, {
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
          <strong>All Bookings</strong>
        </h1>

        {status && (
          <p className="text-red-500 text-sm mb-4 text-center">{status}</p>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 text-left">Client</th>
                <th className="p-4 text-left">Survey Type</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Preferred Date</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Assign Surveyor</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-gray-200 hover:bg-gray-50 text-gray-700"
                >
                  <td className="p-4">{b.user?.name || "N/A"}</td>
                  <td className="p-4">{b.surveyType}</td>
                  <td className="p-4">{b.location}</td>
                  <td className="p-4">
                    {new Date(b.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
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
                  <td className="p-4">
                    <select
                      className="border border-gray-300 rounded-md px-3 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      value={b.assignedSurveyorId || ""}
                      onChange={(e) => handleAssign(b.id, parseInt(e.target.value))}
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
