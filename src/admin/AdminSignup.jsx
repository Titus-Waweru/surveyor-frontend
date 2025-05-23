import { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AdminSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    secretCode: "",
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/admin-signup", form);
      setMessage(res.data.message || "Signup successful!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-2xl bg-white shadow-xl rounded-3xl p-10 md:p-14"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold text-yellow-600 mb-2 text-center font-poppins">
          Admin Signup
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6 font-manrope">
          Create your administrator account to access the Surveyor Management Dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 font-manrope" noValidate>
          <div>
            <label className="text-sm text-gray-700 block mb-1 font-medium">
              <i>Full Name</i>
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Jane Doe"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1 font-medium">
              <i>Email Address</i>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="admin@company.com"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1 font-medium">
              <i>Password</i>
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="********"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1 font-medium">
              <i>Secret Admin Code</i>
            </label>
            <input
              name="secretCode"
              type="text"
              value={form.secretCode}
              onChange={handleChange}
              required
              placeholder="Enter provided code"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center font-manrope text-red-600">{message}</p>
        )}

        <p className="mt-8 text-center text-sm text-gray-500 font-manrope">
          © 2025 Surveyor-on-Demand Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
}
