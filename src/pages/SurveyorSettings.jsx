import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function SurveyorSettings({ user, onLogout }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleToggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
    // Hook this to backend API if needed
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise((res) => setTimeout(res, 1000));
      alert("Password updated.");
      setNewPassword("");
    } catch (err) {
      alert("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full font-manrope" data-aos="fade-up">
      <h1 className="text-3xl font-bold text-yellow-600 mb-8 font-poppins">
        Surveyor Settings
      </h1>

      <div className="space-y-8 max-w-3xl">
        {/* Notifications Toggle */}
        <section className="bg-yellow-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Notifications</h2>
          <label className="flex items-center space-x-3 text-gray-700">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleToggleNotifications}
              className="accent-yellow-500 w-5 h-5"
            />
            <span>Enable email notifications</span>
          </label>
        </section>

        {/* Password Change */}
        <section className="bg-yellow-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Change Password</h2>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4"
          />
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="bg-yellow-400 text-white font-semibold px-5 py-2 rounded hover:bg-yellow-500 transition"
          >
            {loading ? "Saving..." : "Save New Password"}
          </button>
        </section>
      </div>
    </div>
  );
}
