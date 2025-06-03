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
    <div className="min-h-screen bg-[#fff6e5] py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-10">
        {/* Welcome / Hero Section */}
        <div className="text-center" data-aos="fade-down">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-600 font-poppins">
            Welcome back{profile?.name ? `, ${profile.name}` : ""}!
          </h1>
          <p className="text-gray-600 mt-2 font-manrope text-base md:text-lg">
            We're glad to have you with us. Manage your profile and stay connected with LandLink.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-aos="fade-up">
          <div className="bg-white rounded-2xl p-5 shadow text-center">
            <h2 className="text-yellow-500 font-bold text-lg">Profile Completion</h2>
            <p className="text-3xl font-bold text-gray-700 mt-2">
              {profile ? (profile.profileImageUrl ? "100%" : "80%") : "--"}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow text-center">
            <h2 className="text-yellow-500 font-bold text-lg">Bookings Made</h2>
            <p className="text-3xl font-bold text-gray-700 mt-2">
              {/* Add real data from backend later */}
              5
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow text-center">
            <h2 className="text-yellow-500 font-bold text-lg">Member Since</h2>
            <p className="text-3xl font-bold text-gray-700 mt-2">
              {/* You can format using moment.js or manually later */}
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "--"}
            </p>
          </div>
        </div>

        {/* Profile Form Section */}
        <div
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
          data-aos="fade-up"
        >
          <h2 className="text-2xl font-semibold text-yellow-600 mb-6 font-poppins text-center">
            Edit Profile
          </h2>

          {profile ? (
            <form onSubmit={handleUpdate} className="space-y-6 font-manrope">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

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
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200"
                />
              </div>

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

        {/* About Section */}
        <div
          className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-xl shadow-md"
          data-aos="fade-up"
        >
          <h3 className="font-bold text-yellow-700 text-lg mb-2">Did You Know?</h3>
          <p className="text-gray-700 font-manrope">
            LandLink connects you with certified land surveyors in your region, streamlines booking, and helps you track your land’s progress from anywhere. You're part of a modern revolution in land ownership.
          </p>
        </div>
      </div>
    </div>
  );
}
