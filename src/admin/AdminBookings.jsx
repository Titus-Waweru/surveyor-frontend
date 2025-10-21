import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import BookingMap from "../components/dashboard/BookingMap";

const API = import.meta.env.VITE_API_URL;

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [admins, setAdmins] = useState([]); // ✅ NEW: Admins state
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState("bookings"); // ✅ NEW: Tab state

  // 👇 New: Role selection (surveyor or gis-expert)
  const [selectedRole, setSelectedRole] = useState("surveyor");

  const [showMaps, setShowMaps] = useState(() => {
    const saved = localStorage.getItem("adminShowMaps");
    return saved === "true";
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchBookings();
    fetchAdmins(); // ✅ NEW: Fetch admins
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

  // ✅ NEW: Fetch admins
  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${API}/admins/all`);
      setAdmins(res.data);
    } catch (err) {
      console.error("Error fetching admins:", err);
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

  // ✅ NEW: Online status simulation for admins
  const getOnlineStatus = (adminId) => {
    const statuses = ['online', 'offline', 'away'];
    return statuses[adminId % 3];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 border-green-200';
      case 'away': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'online': return '🟢';
      case 'away': return '🟡';
      default: return '⚫';
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] py-12 px-4 font-manrope flex justify-center items-start">
      <div
        className="w-full max-w-7xl bg-white shadow-xl rounded-3xl p-8 md:p-12"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold font-poppins text-yellow-600 text-center mb-8">
          Admin Management
        </h1>

        {status && (
          <p className="text-red-500 text-sm mb-4 text-center">{status}</p>
        )}

        {/* ✅ NEW: Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-6 py-3 font-medium text-lg ${
              activeTab === "bookings"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("bookings")}
          >
            📋 Bookings ({bookings.length})
          </button>
          <button
            className={`px-6 py-3 font-medium text-lg ${
              activeTab === "admins"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("admins")}
          >
            👥 Administrators ({admins.length})
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <>
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

            {/* ✅ Table - UPDATED WITH COUNTY COLUMN */}
            <div className="overflow-x-auto border rounded-xl shadow-sm">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Survey Type</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">County</th>
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
                        
                        {/* ✅ County Information */}
                        <td className="px-4 py-3">
                          {b.county ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {b.county}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">Not specified</span>
                          )}
                        </td>
                        
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
                          <td colSpan="7" className="px-4 py-3">
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
          </>
        )}

        {/* ✅ NEW: Admins Tab */}
        {activeTab === "admins" && (
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">Administrator</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Contact Information</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Last Active</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Admin ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">👨‍💼</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Administrators Found</h3>
                        <p className="text-gray-600">
                          There are no admin accounts registered in the system yet.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => {
                    const status = getOnlineStatus(admin.id);
                    return (
                      <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            {admin.profileImageUrl ? (
                              <img 
                                src={admin.profileImageUrl} 
                                alt={admin.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                {admin.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                              <p className="text-xs text-gray-500">System Administrator</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-gray-900 font-medium">{admin.email}</p>
                            {admin.phoneNumber && (
                              <p className="text-gray-600 text-sm">📞 {admin.phoneNumber}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                            <span className="mr-2 text-base">{getStatusDot(status)}</span>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-700 font-medium">
                            {status === 'online' ? 'Active now' : 
                             status === 'away' ? '2 hours ago' : 'Yesterday'}
                          </p>
                          <p className="text-xs text-gray-500">Last activity</p>
                        </td>
                        <td className="px-6 py-4">
                          <code className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono">
                            #{admin.id.toString().padStart(3, '0')}
                          </code>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}