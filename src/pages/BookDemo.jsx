import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";

export default function BookDemo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    date: "",
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Demo request submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="bg-[#fff6e5] min-h-screen font-poppins px-6 md:px-20 py-16">
      {/* Back to Landing Page */}
      <Link
        to="/"
        className="inline-flex items-center text-sm text-yellow-600 hover:underline mb-6"
      >
        ← Back
      </Link>

      <div
        className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-lg"
        data-aos="fade-up"
      >
        {submitted ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-2">
              Demo Booked Successfully!
            </h2>
            <p className="text-gray-700">
              🎉 Thank you! We’ll reach out shortly to confirm your demo.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Schedule Your Personalized Demo
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-xl mx-auto">
              Discover how LandLink transforms land services — from bookings to
              real-time payments. Pick a time that works for you and we’ll show
              you around.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Work Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company / Organization"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />

              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-2xl shadow w-full transition"
              >
                Book My Demo
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              💡 <span className="font-medium">Tip:</span> Early bookings get
              priority slots. Secure your walkthrough now!
            </div>
          </>
        )}
      </div>
    </div>
  );
}
