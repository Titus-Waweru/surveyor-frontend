import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const baseUrl = import.meta.env.VITE_API_URL;

export default function AdminProfile() {
  const [admin, setAdmin] = useState({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    profileImageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  
  // ✅ NEW: Additional admin statistics
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    assignedBookings: 0,
    totalAdmins: 0,
    activeAdmins: 0
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchProfile();
    fetchAdminStats(); // ✅ NEW: Fetch statistics
  }, []);

  const fetchProfile = async () => {
    try {
      const email = JSON.parse(localStorage.getItem("user"))?.email;
      if (!email) {
        setStatus("❌ Admin email not found.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${baseUrl}/admin/profile-by-email?email=${email}`);
      setAdmin(res.data);
      if (res.data.profileImageUrl) {
        const isAbsolute = res.data.profileImageUrl.startsWith("http");
        setImagePreview(isAbsolute ? res.data.profileImageUrl : `${baseUrl}${res.data.profileImageUrl}`);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setStatus("❌ Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Fetch admin statistics
  const fetchAdminStats = async () => {
    try {
      const [bookingsRes, adminsRes] = await Promise.all([
        axios.get(`${baseUrl}/admin/bookings/all`),
        axios.get(`${baseUrl}/admins/all`)
      ]);
      
      const bookings = bookingsRes.data;
      const admins = adminsRes.data;
      
      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === "Pending").length,
        assignedBookings: bookings.filter(b => b.assignedSurveyorId).length,
        totalAdmins: admins.length,
        activeAdmins: admins.filter(a => getOnlineStatus(a.id) === 'online').length
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // ✅ NEW: Online status simulation (same as other components)
  const getOnlineStatus = (adminId) => {
    const statuses = ['online', 'offline', 'away'];
    return statuses[adminId % 3];
  };

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin.id) return setStatus("❌ Missing admin ID.");

    setStatus("Updating...");

    const formData = new FormData();
    formData.append("name", admin.name);
    formData.append("email", admin.email);
    formData.append("phoneNumber", admin.phoneNumber || "");
    if (imageFile) formData.append("profileImage", imageFile);

    try {
      await axios.put(`${baseUrl}/admin/profile/${admin.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("✅ Profile updated successfully!");
      fetchProfile(); // Refresh data
    } catch (err) {
      console.error("Update failed:", err);
      setStatus("❌ Update failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] py-10 px-4 font-manrope">
      <div className="max-w-6xl mx-auto">
        {/* ✅ NEW: Header with Welcome Message */}
        <div className="text-center mb-8" data-aos="fade-down">
          <h1 className="text-4xl font-bold text-yellow-600 font-poppins mb-2">
            Administrator Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your profile and view system overview
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ✅ NEW: Statistics Cards Column */}
          <div className="space-y-6" data-aos="fade-right">
            {/* System Overview Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                System Overview
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-blue-700">{stats.totalBookings}</p>
                  </div>
                  <div className="text-blue-500 text-xl">📋</div>
                </div>

                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Pending Bookings</p>
                    <p className="text-2xl font-bold text-yellow-700">{stats.pendingBookings}</p>
                  </div>
                  <div className="text-yellow-500 text-xl">⏳</div>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Assigned Bookings</p>
                    <p className="text-2xl font-bold text-green-700">{stats.assignedBookings}</p>
                  </div>
                  <div className="text-green-500 text-xl">✅</div>
                </div>

                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">System Admins</p>
                    <p className="text-2xl font-bold text-purple-700">{stats.totalAdmins}</p>
                    <p className="text-xs text-gray-500">
                      {stats.activeAdmins} active now
                    </p>
                  </div>
                  <div className="text-purple-500 text-xl">👥</div>
                </div>
              </div>
            </div>

            {/* ✅ NEW: Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = '/admin/bookings'}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="flex items-center text-gray-700">
                    <span className="text-lg mr-3">📋</span>
                    Manage Bookings
                  </span>
                </button>
                <button 
                  onClick={() => window.location.href = '/admin/admins'}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="flex items-center text-gray-700">
                    <span className="text-lg mr-3">👥</span>
                    View Administrators
                  </span>
                </button>
                <button 
                  onClick={() => window.location.href = '/admin/surveyors'}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="flex items-center text-gray-700">
                    <span className="text-lg mr-3">👨‍💼</span>
                    Manage Surveyors
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ✅ UPDATED: Profile Form Column (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100" data-aos="fade-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 font-poppins">
                  Profile Information
                </h2>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  👑 Administrator
                </span>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading profile...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Profile Image Section */}
                  <div className="flex flex-col items-center justify-start gap-6">
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.png"}
                        alt="Profile"
                        className="w-32 h-32 object-cover rounded-full border-4 border-yellow-400 shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Change Profile Picture
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                      />
                    </div>

                    {/* ✅ NEW: Admin Info Card */}
                    <div className="w-full bg-gray-50 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Admin Details</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>ID: <span className="font-mono">#{admin.id.toString().padStart(3, '0')}</span></p>
                        <p>Role: <span className="text-green-600 font-medium">System Administrator</span></p>
                        <p>Status: <span className="text-green-600 font-medium">Active</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Form Section */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="name"
                        value={admin.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={admin.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={admin.phoneNumber || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                        placeholder="+254 700 000 000"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Update Profile Information
                    </button>

                    {status && (
                      <div className={`p-3 rounded-lg text-center ${
                        status.startsWith("✅")
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : status.startsWith("❌")
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}>
                        {status}
                      </div>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}