import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function ClientSettings({ user, onLogout }) {
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    role: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 });
    if (user?.email) fetchSettings();
  }, [user?.email]);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile`, {
        params: { email: user.email },
      });
      setSettings({
        notificationsEnabled: res.data.notificationsEnabled,
        role: res.data.role,
        status: res.data.status,
      });
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      alert("Failed to load settings.");
    }
  };

  const handleToggleNotifications = async () => {
    try {
      await axios.put(`${API_BASE_URL}/profile/toggle-notifications`, {
        email: user.email,
      });
      setSettings((prev) => ({
        ...prev,
        notificationsEnabled: !prev.notificationsEnabled,
      }));
    } catch (err) {
      console.error("Toggle error:", err);
      alert("Failed to update notification settings.");
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/profile/change-password`, {
        email: user.email,
        newPassword,
      });
      alert("✅ Password updated.");
      setNewPassword("");
    } catch (err) {
      alert("❌ Failed to update password.");
      console.error("Password update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] px-2 sm:px-4 py-10 font-manrope">
      <div
        className="w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-10 md:p-14"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold text-yellow-600 mb-10 text-center font-poppins">
          Settings
        </h1>

        <div className="space-y-10">
          {/* Account Info */}
          <section className="bg-yellow-50 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Account Info</h2>
            <p className="mb-2">
              <strong>Role:</strong> {settings.role}
            </p>
            <p>
              <strong>Status:</strong> {settings.status}
            </p>
          </section>

          {/* Notifications */}
          <section className="bg-yellow-50 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Notifications</h2>
            <label className="flex items-center space-x-3 text-gray-700">
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={handleToggleNotifications}
                className="accent-yellow-500 w-5 h-5"
              />
              <span>Enable email notifications</span>
            </label>
          </section>

          {/* Change Password */}
          <section className="bg-yellow-50 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Change Password</h2>
            <input
              type="password"
              placeholder="New password"
              className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              className="bg-yellow-400 text-white font-semibold px-6 py-2 rounded hover:bg-yellow-500 disabled:opacity-60"
              onClick={handleChangePassword}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
