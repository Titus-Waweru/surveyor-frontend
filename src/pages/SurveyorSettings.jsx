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
    // TODO: Hook this to backend API if needed
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
    } catch {
      alert("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] py-12 px-2 sm:px-4 font-manrope flex justify-center items-start overflow-x-hidden">
      <div
        className="w-full max-w-3xl bg-white shadow-xl rounded-3xl px-4 sm:px-6 md:px-10 py-8 mx-auto"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold text-yellow-600 mb-8 text-center font-poppins tracking-wide">
          Surveyor Settings
        </h1>

        <div className="space-y-10">
          {/* Notifications Toggle */}
          <section className="bg-yellow-50 p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Notifications
            </h2>
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
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Change Password
            </h2>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 mb-5 transition"
            />
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md disabled:opacity-60 transition duration-200"
            >
              {loading ? "Saving..." : "Save New Password"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
