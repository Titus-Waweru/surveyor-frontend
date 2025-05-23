import { useState } from "react";

export default function SurveyorSettings({ user, onLogout }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">Surveyor Settings</h1>

      <div className="space-y-6">

        {/* Notifications Toggle */}
        <section className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Notifications</h2>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleToggleNotifications}
              className="accent-indigo-600 w-5 h-5"
            />
            <span>Enable email notifications</span>
          </label>
        </section>

        {/* Password Change */}
        <section className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Change Password</h2>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input w-full mb-3"
          />
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {loading ? "Saving..." : "Save New Password"}
          </button>
        </section>
      </div>
    </div>
  );
}
