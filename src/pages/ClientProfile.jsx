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
      AOS.init({ 
        duration: 1000,
        once: true,
        easing: 'ease-out-cubic'
      });
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
        headers: {
          'Cache-Control': 'no-cache'
        }
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
    
    if (!form.name.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your name",
      });
      return;
    }

    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("name", form.name.trim());
    formData.append("phoneNumber", form.phoneNumber);
    if (image) formData.append("profileImage", image);

    setLoading(true);
    try {
      const res = await axios.put(`${API_BASE_URL}/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000,
      });
      setProfile(res.data.user);
      setImage(null);
      setMessage({
        type: "success",
        text: "Profile updated successfully 🎉",
      });
    } catch (err) {
      console.error("❌ Update error:", err);
      const errorText = err.response?.data?.message || "Failed to update profile. Please try again.";
      setMessage({
        type: "error",
        text: errorText,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Image size should be less than 5MB",
        });
        return;
      }
      setImage(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-6 font-manrope flex justify-center items-start">
      <div className="w-full max-w-2xl">
        <div 
          className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl px-6 sm:px-8 lg:px-12 py-8 border border-white/20"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {/* Header */}
          <div className="text-center mb-8" data-aos="fade-down" data-aos-delay="200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl shadow-lg mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-poppins">
              My Profile
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Manage your personal information</p>
          </div>

          {/* Message Alert */}
          {message && (
            <div
              aria-live="polite"
              className={`mb-8 px-6 py-4 rounded-2xl border-l-4 ${
                message.type === "error"
                  ? "bg-red-50 border-red-400 text-red-700"
                  : "bg-emerald-50 border-emerald-400 text-emerald-700"
              } shadow-sm transform transition-all duration-300 ease-in-out`}
              data-aos="fade-down"
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  message.type === "error" ? "bg-red-400" : "bg-emerald-400"
                }`}></div>
                <span className="font-semibold">{message.text}</span>
              </div>
            </div>
          )}

          {profile ? (
            <form onSubmit={handleUpdate} className="space-y-8">
              {/* Email Field */}
              <div data-aos="fade-right" data-aos-delay="300">
                <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    readOnly
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 pl-10 bg-gray-50/50 text-gray-600 font-medium focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Name Field */}
              <div data-aos="fade-right" data-aos-delay="400">
                <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 pl-10 bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div data-aos="fade-right" data-aos-delay="500">
                <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide" htmlFor="phone">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="phone"
                    value={form.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 pl-10 bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Profile Image Field */}
              <div data-aos="fade-right" data-aos-delay="600">
                <label className="block text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                  Profile Image
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  {/* Current Image */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                        {profile.profileImageUrl ? (
                          <img
                            src={`${API_BASE_URL.replace("/api", "")}${profile.profileImageUrl}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {image && (
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Button */}
                  <div className="flex-grow">
                    <div className="relative inline-block">
                      <label
                        htmlFor="profile-upload"
                        className="cursor-pointer inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        {image ? "Change Photo" : "Upload New Photo"}
                      </label>
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-3">JPG, PNG or GIF • Max 5MB</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div data-aos="fade-up" data-aos-delay="700">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-60 disabled:transform-none disabled:hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating Profile...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12" data-aos="fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-amber-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m8-10h-4M6 12H2" />
                </svg>
              </div>
              <p className="text-xl text-gray-600 font-medium">Loading your profile...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}