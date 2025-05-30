import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ContactUs() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#fff6e5] min-h-screen font-manrope px-4 sm:px-8 md:px-20 py-16">
      {/* Header */}
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Get in Touch</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          We’re here to help you with bookings, payments, support or general inquiries.
          Reach out through any of the channels below and we’ll get back to you promptly.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-16" data-aos="fade-up" data-aos-delay="100">
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Email Us</h2>
          <p className="text-gray-600 mb-1">support@landlink.app</p>
          <p className="text-sm text-gray-500">Available Mon–Fri, 9AM–6PM</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Call Us</h2>
          <p className="text-gray-600 mb-1">+254 745 745 186</p>
          <p className="text-sm text-gray-500">Customer Support Line</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Visit Us</h2>
          <p className="text-gray-600 mb-1">Nairobi, Kenya</p>
          <p className="text-sm text-gray-500">LandLink HQ</p>
        </div>
      </div>

      {/* Embedded Map (optional) */}
      <div data-aos="fade-up" data-aos-delay="200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Our Location</h2>
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow">
          <iframe
            title="LandLink HQ Location"
            src="https://maps.google.com/maps?q=Nairobi,+Kenya&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
