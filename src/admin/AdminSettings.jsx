import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const baseUrl = import.meta.env.VITE_API_URL;

export default function AdminSettings() {
  const [adminId, setAdminId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notificationPref, setNotificationPref] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "admin") {
      setAdminId(user.id);
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
    } catch (err) {
      console.error("Notification update failed:", err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!adminId) return;

    if (
      confirm("⚠️ Are you sure you want to delete your account? This action cannot be undone.")
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
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-10 font-manrope">
      <div
        className="w-full max-w-4xl bg-white shadow-xl rounded-3xl p-10 md:p-14 space-y-10"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold text-yellow-600 text-center font-poppins">
          <strong>Admin Settings</strong>
        </h1>

        {/* Password Change */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="grid gap-4 md:grid-cols-2">
            <input
              type="password"
              placeholder="New Password"
              className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-md md:col-span-2 shadow-md"
            >
              Update Password
            </button>
          </form>
          {status && (
            <p className="mt-2 text-sm text-center text-gray-600">{status}</p>
          )}
        </section>

        {/* Notification Preferences */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Notifications</h2>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationPref}
                onChange={handleNotificationsToggle}
                className="form-checkbox h-5 w-5 text-yellow-500"
              />
              <span className="ml-2 text-gray-700">Email Notifications</span>
            </label>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-red-600">Danger Zone</h2>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md shadow-md"
          >
            Delete Account
          </button>
          <p className="text-sm text-gray-500 mt-2">
            This action is irreversible. Proceed with caution.
          </p>
        </section>
      </div>
    </div>
  );
}
