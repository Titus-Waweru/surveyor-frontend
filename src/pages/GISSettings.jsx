import React, { useState } from "react";

export default function GISSettings({ user }) {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
  });

  function toggleSetting(e) {
    const { name, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert("Settings saved! (Dummy action)");
    // Call API to save settings if needed
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">GIS Expert Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="notifications"
            name="notifications"
            checked={settings.notifications}
            onChange={toggleSetting}
            className="h-5 w-5"
          />
          <label htmlFor="notifications" className="font-semibold">
            Enable Notifications
          </label>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="darkMode"
            name="darkMode"
            checked={settings.darkMode}
            onChange={toggleSetting}
            className="h-5 w-5"
          />
          <label htmlFor="darkMode" className="font-semibold">
            Enable Dark Mode
          </label>
        </div>
        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
