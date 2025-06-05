import React, { useState } from "react";

export default function GISProfile({ user }) {
  // Dummy state for editable profile info
  const [profile, setProfile] = useState({
    name: user?.email || "",
    phone: "",
    department: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert("Profile updated! (Dummy action)");
    // Here you can call your API to save profile changes
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">GIS Expert Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Name / Email</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={profile.department}
            onChange={handleChange}
            placeholder="Your department"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
