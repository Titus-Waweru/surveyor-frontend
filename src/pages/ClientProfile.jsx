import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function ClientProfile({ user }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", phoneNumber: "" });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    if (user?.email) fetchProfile();
  }, [user?.email]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile`, {
        params: { email: user.email },
      });
      setProfile(res.data);
      setForm({
        name: res.data.name || "",
        phoneNumber: res.data.phoneNumber || "",
      });
    } catch (err) {
      console.error("❌ Profile fetch error:", err);
      alert("Failed to load profile. Please try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("name", form.name);
    formData.append("phoneNumber", form.phoneNumber);
    if (image) formData.append("profileImage", image);

    setLoading(true);
    try {
      const res = await axios.put(`${API_BASE_URL}/profile`, formData);
      alert("✅ Profile updated successfully.");
      setProfile(res.data.user);
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] flex justify-center items-start py-10 px-4">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-10 md:p-14"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold text-yellow-600 mb-10 text-center font-poppins">
          My Profile
        </h1>

        {profile ? (
          <form onSubmit={handleUpdate} className="space-y-6 font-manrope">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Profile Image Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
              {profile.profileImageUrl && (
                <img
                  src={`${API_BASE_URL.replace("/api", "")}${profile.profileImageUrl}`}
                  alt="Profile"
                  className="rounded-full border shadow-sm mb-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                  }}
                />
              )}

              {/* Custom Upload Button */}
              <div className="relative inline-block">
                <label
                  htmlFor="profile-upload"
                  className="cursor-pointer inline-block bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-semibold py-2 px-4 rounded-md text-sm"
                >
                  {image ? "Change Photo" : "Upload Photo"}
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded shadow disabled:opacity-60 transition duration-200"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-600">Loading profile...</p>
        )}
      </div>
    </div>
  );
}
