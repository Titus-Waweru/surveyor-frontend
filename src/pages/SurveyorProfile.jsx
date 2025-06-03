import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import API from "../utils/axios"; // ✅ Use configured axios instance

export default function SurveyorProfile({ user }) {
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
      const res = await API.get("/profile", {
        params: { email: user.email },
      });
      setProfile(res.data);
      setForm({
        name: res.data.name || "",
        phoneNumber: res.data.phoneNumber || "",
      });
    } catch (err) {
      console.error("❌ Error loading profile:", err);
      alert("Failed to load profile.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("email", user.email);
    payload.append("name", form.name);
    payload.append("phoneNumber", form.phoneNumber);
    if (image) payload.append("profileImage", image);

    setLoading(true);
    try {
      const res = await API.put("/profile", payload);
      alert("✅ Profile updated.");
      setProfile(res.data.user);
    } catch (err) {
      console.error("❌ Error updating:", err);
      alert("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] flex justify-center items-start py-10 px-4">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 md:p-12"
        data-aos="fade-up"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-yellow-600 mb-8 text-center font-poppins">
          Surveyor Profile
        </h1>

        {profile ? (
          <form onSubmit={handleSubmit} className="space-y-6 font-manrope">
            {/* Email Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="px-4 py-2 bg-gray-100 rounded-md border text-sm text-gray-800">
                {profile.email}
              </div>
            </div>

            {/* ISK Number Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ISK Number</label>
              <div className="px-4 py-2 bg-gray-100 rounded-md border text-sm text-gray-800">
                {profile.iskNumber || "Not provided"}
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
              {profile.profileImageUrl && (
                <div className="mb-3">
                  <img
                    src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${profile.profileImageUrl}`}
                    alt="Profile"
                    className="rounded-full border shadow w-16 h-16 object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="block w-full text-sm text-gray-500 
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded-md shadow disabled:opacity-60 transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-600">Loading profile...</p>
        )}
      </div>
    </div>
  );
}
