import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

export default function SurveyorProfile({ user, onLogout }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    iskNumber: "",
    profileImage: null,
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile?email=${user.email}`);
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          phoneNumber: res.data.phoneNumber || "",
          iskNumber: res.data.iskNumber || "",
          profileImage: null,
        });
        setPreviewUrl(res.data.profileImageUrl ? `http://localhost:5000${res.data.profileImageUrl}` : "");
      } catch (err) {
        console.error("Error loading profile", err);
        setMessage("Failed to load profile.");
      }
    };

    fetchProfile();
  }, [user.email]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files[0]) {
      setFormData((prev) => ({ ...prev, profileImage: files[0] }));
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("email", user.email);
      payload.append("name", formData.name);
      payload.append("phoneNumber", formData.phoneNumber);
      if (formData.profileImage) {
        payload.append("profileImage", formData.profileImage);
      }

      await axios.put("http://localhost:5000/api/profile", payload);
      setMessage("✅ Profile updated successfully.");
    } catch (err) {
      console.error("Error updating profile", err);
      setMessage("❌ Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-10 md:p-14"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center font-poppins">
          Surveyor Profile
        </h2>

        {message && (
          <div className="mb-4 px-4 py-2 rounded font-manrope text-center bg-indigo-50 text-indigo-700 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6 font-manrope">
          <div className="flex items-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full border object-cover mr-4"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                No Image
              </div>
            )}
            <input
              type="file"
              name="profileImage"
              onChange={handleChange}
              accept="image/*"
              className="text-sm"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              name="email"
              value={formData.email}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Phone Number</label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">ISK Number</label>
            <input
              name="iskNumber"
              value={formData.iskNumber}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>

          <button
            type="submit"
            className="bg-yellow-400 text-white font-semibold px-6 py-2 rounded hover:bg-yellow-500 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
