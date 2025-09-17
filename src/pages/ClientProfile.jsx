import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function ClientProfile({ user }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user?.email) {
      AOS.init({ duration: 1000 });
      fetchProfile();
    }
  }, [user?.email]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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
      setMessage({
        type: "error",
        text: "Failed to load profile. Please try again.",
      });
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
      setProfile(res.data.user);
      setMessage({
        type: "success",
        text: "Profile updated successfully ✅",
      });
    } catch (err) {
      console.error("❌ Update error:", err);
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] p-2 sm:p-4 font-manrope flex justify-center items-start overflow-x-hidden">
      <div
        className="w-full bg-white shadow-xl rounded-3xl px-4 sm:px-6 md:px-10 py-8"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold text-yellow-600 mb-6 text-center font-poppins">
          My Profile
        </h1>

        {message && (
          <div
            aria-live="polite"
            className={`mb-6 px-4 py-2 rounded text-center font-medium ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {profile ? (
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Email (read-only) */}
            <div>
              <label className="block font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={user.email}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Name Field */}
            <div>
              <label className="block font-medium mb-1" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block font-medium mb-1" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Profile Image Field */}
            <div>
              <label className="block font-medium mb-2">Profile Image</label>
              {profile.profileImageUrl && (
                <img
                  src={`${API_BASE_URL.replace("/api", "")}${profile.profileImageUrl}`}
                  alt="Profile"
                  className="rounded-full border shadow-sm mb-3"
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                  }}
                />
              )}
              <div className="relative inline-block">
                <label
                  htmlFor="profile-upload"
                  className="cursor-pointer inline-block bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-semibold py-2 px-4 rounded-md text-sm transition"
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
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md disabled:opacity-60 transition duration-200"
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
