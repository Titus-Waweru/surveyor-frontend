import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const baseUrl = import.meta.env.VITE_API_URL;

export default function AdminSettings() {
  const [adminId, setAdminId] = useState(null);
  const [adminData, setAdminData] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notificationPref, setNotificationPref] = useState(true);
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState("security"); // ✅ NEW: Tab system

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "admin") {
      setAdminId(user.id);
      setAdminData(user);
      fetchNotificationPref(user.id);
    }
  }, []);

  const fetchNotificationPref = async (id) => {
    try {
      const res = await axios.get(`${baseUrl}/admin/profile/${id}`);
      setNotificationPref(res.data.notificationsEnabled ?? true);
    } catch (err) {
      console.error("Failed to fetch notification preference");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!adminId) return;
    if (newPassword !== confirmPassword) {
      return setStatus("❌ Passwords do not match.");
    }

    try {
      await axios.put(`${baseUrl}/admin/update-password/${adminId}`, {
        password: newPassword,
      });
      setStatus("✅ Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password update failed:", err);
      setStatus("❌ Failed to update password.");
    }
  };

  const handleNotificationsToggle = async () => {
    const updatedPref = !notificationPref;
    setNotificationPref(updatedPref);

    try {
      await axios.put(`${baseUrl}/admin/notification/${adminId}`, {
        notificationsEnabled: updatedPref,
      });
      setStatus(`✅ Notifications ${updatedPref ? 'enabled' : 'disabled'}`);
    } catch (err) {
      console.error("Notification update failed:", err);
      setStatus("❌ Failed to update notifications");
    }
  };

  const handleDeleteAccount = async () => {
    if (!adminId) return;

    if (
      confirm("⚠️ Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently remove all your data.")
    ) {
      try {
        await axios.delete(`${baseUrl}/admin/delete/${adminId}`);
        alert("Your account has been deleted.");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } catch (err) {
        console.error("Account deletion failed:", err);
        alert("❌ Failed to delete account.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] py-10 px-4 font-manrope">
      <div className="max-w-6xl mx-auto">
        {/* ✅ NEW: Header Section */}
        <div className="text-center mb-8" data-aos="fade-down">
          <h1 className="text-4xl font-bold text-yellow-600 font-poppins mb-2">
            Administrator Settings
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your account security and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ✅ NEW: Sidebar Navigation */}
          <div className="lg:col-span-1" data-aos="fade-right">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === "security" 
                      ? "bg-yellow-50 text-yellow-700 border border-yellow-200" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  🔐 Security & Password
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === "notifications" 
                      ? "bg-yellow-50 text-yellow-700 border border-yellow-200" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  🔔 Notifications
                </button>
                <button
                  onClick={() => setActiveTab("danger")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === "danger" 
                      ? "bg-red-50 text-red-700 border border-red-200" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  ⚠️ Danger Zone
                </button>
              </nav>

              {/* ✅ NEW: Account Info Card */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">Account Information</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Admin ID:</span>
                    <span className="font-mono">#{adminId?.toString().padStart(3, '0')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Role:</span>
                    <span className="text-green-600 font-medium">Administrator</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ UPDATED: Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100" data-aos="fade-up">
              
              {/* Security & Password Tab */}
              {activeTab === "security" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 font-poppins">
                      🔐 Security Settings
                    </h2>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Secure
                    </span>
                  </div>

                  <div className="grid gap-8">
                    {/* Password Change Card */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Change Password
                      </h3>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              placeholder="Enter new password"
                              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              placeholder="Confirm new password"
                              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                          Update Password
                        </button>
                      </form>
                    </div>

                    {/* Security Tips Card */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3">🔒 Security Tips</h3>
                      <ul className="space-y-2 text-sm text-blue-700">
                        <li className="flex items-center">
                          <span className="mr-2">✓</span> Use a strong, unique password
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">✓</span> Avoid using personal information
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">✓</span> Update password regularly
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">✓</span> Never share your password
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 font-poppins">
                      🔔 Notification Preferences
                    </h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Customizable
                    </span>
                  </div>

                  <div className="space-y-6">
                    {/* Notification Settings Card */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            Email Notifications
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Receive email alerts for new bookings and system updates
                          </p>
                        </div>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationPref}
                            onChange={handleNotificationsToggle}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                        </label>
                      </div>
                    </div>

                    {/* Notification Types Card */}
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-lg font-semibold text-green-800 mb-3">📬 Notification Types</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                        <div className="flex items-center">
                          <span className="mr-2">•</span> New booking requests
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">•</span> Surveyor assignments
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">•</span> System updates
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">•</span> Security alerts
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === "danger" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-red-600 font-poppins">
                      ⚠️ Danger Zone
                    </h2>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      Critical
                    </span>
                  </div>

                  <div className="space-y-6">
                    {/* Account Deletion Card */}
                    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                      <h3 className="text-lg font-semibold text-red-800 mb-3">🗑️ Delete Account</h3>
                      <p className="text-red-700 mb-4">
                        Permanently delete your administrator account and all associated data. 
                        This action cannot be undone.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                      >
                        Delete My Account
                      </button>
                      <p className="text-sm text-red-600 mt-3">
                        ⚠️ Warning: This will immediately remove your access and cannot be reversed.
                      </p>
                    </div>

                    {/* Data Warning Card */}
                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                      <h3 className="text-lg font-semibold text-orange-800 mb-3">📋 What Will Be Deleted</h3>
                      <ul className="space-y-2 text-sm text-orange-700">
                        <li className="flex items-center">
                          <span className="mr-2">•</span> Your administrator profile
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">•</span> All your account data
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">•</span> Access to the admin dashboard
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">•</span> System permissions
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Message */}
              {status && (
                <div className={`mt-6 p-4 rounded-lg text-center ${
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
          </div>
        </div>
      </div>
    </div>
  );
}