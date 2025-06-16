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
      setImage(null);
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] flex justify-center items-start py-6 px-0.5 font-manrope">
      <div
        className="w-full bg-white rounded-xl shadow-md px-3 sm:px-5 py-6 sm:py-8 border border-yellow-200"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold text-yellow-600 mb-8 text-center font-poppins tracking-wide">
          My Profile
        </h1>

        {profile ? (
          <form onSubmit={handleUpdate} className="space-y-7">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Profile Image Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Image
              </label>
              <div className="flex items-center space-x-4">
                {profile.profileImageUrl ? (
                  <img
                    src={`${API_BASE_URL.replace("/api", "")}${profile.profileImageUrl}`}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border shadow-sm object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border bg-gray-100 flex items-center justify-center text-gray-400">
                    N/A
                  </div>
                )}

                <div>
                  <label
                    htmlFor="profile-upload"
                    className="cursor-pointer inline-block bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-semibold py-2 px-5 rounded-lg text-sm select-none transition"
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
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md disabled:opacity-60 transition duration-200"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-center text-gray-600">Loading profile...</p>
        )}
      </div>
    </div>
  );
}
