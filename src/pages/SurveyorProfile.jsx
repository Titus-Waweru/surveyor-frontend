import { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Surveyor Profile</h2>

      {message && <div className="mb-4 text-sm text-blue-700">{message}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex items-center mb-6">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full border mr-4 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
              No Image
            </div>
          )}
          <input type="file" name="profileImage" onChange={handleChange} accept="image/*" className="text-sm" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            value={formData.email}
            className="input w-full bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">ISK Number</label>
          <input
            name="iskNumber"
            value={formData.iskNumber}
            className="input w-full bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
