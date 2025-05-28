import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const baseUrl = import.meta.env.VITE_API_URL;

export default function AdminProfile() {
  const [admin, setAdmin] = useState({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    profileImageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const email = JSON.parse(localStorage.getItem("user"))?.email;
      if (!email) {
        setStatus("❌ Admin email not found.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${baseUrl}/admin/profile-by-email?email=${email}`);
      setAdmin(res.data);
      if (res.data.profileImageUrl) {
        const isAbsolute = res.data.profileImageUrl.startsWith("http");
        setImagePreview(isAbsolute ? res.data.profileImageUrl : `${baseUrl}${res.data.profileImageUrl}`);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setStatus("❌ Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin.id) return setStatus("❌ Missing admin ID.");

    setStatus("Updating...");

    const formData = new FormData();
    formData.append("name", admin.name);
    formData.append("email", admin.email);
    formData.append("phoneNumber", admin.phoneNumber || "");
    if (imageFile) formData.append("profileImage", imageFile);

    try {
      await axios.put(`${baseUrl}/admin/profile/${admin.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("✅ Profile updated successfully!");
      fetchProfile(); // Refresh data
    } catch (err) {
      console.error("Update failed:", err);
      setStatus("❌ Update failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-10 font-manrope">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-3xl p-10 md:p-14" data-aos="fade-up">
        <h1 className="text-3xl font-bold text-yellow-600 text-center mb-8 font-poppins">
          <strong>Admin Profile</strong>
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading profile...</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Image */}
            <div className="flex flex-col items-center justify-start gap-4">
              <img
                src={imagePreview || "/placeholder.png"}
                alt="Profile"
                className="w-28 h-28 object-cover rounded-full border-2 border-yellow-500 shadow"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-gray-600"
              />
            </div>

            {/* Profile Info */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input
                  name="name"
                  value={admin.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={admin.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={admin.phoneNumber || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2.5 rounded-md transition-all shadow-md"
              >
                Update Profile
              </button>

              {status && (
                <p
                  className={`text-sm text-center mt-2 ${
                    status.startsWith("✅")
                      ? "text-green-600"
                      : status.startsWith("❌")
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {status}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
