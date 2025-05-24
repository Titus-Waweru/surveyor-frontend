import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="bg-[#fff6e5] min-h-screen font-poppins">
      {/* Header with Tiny Logo */}
      <header className="flex items-center justify-between px-8 md:px-20 py-6">
        <Link to="/">
       <img
  src="/assets/logo.png"
  alt="LandLink Logo"
  className="h-[90px] w-auto max-w-[220px] object-contain"
/>





        </Link>
        <div className="space-x-4 hidden md:block">
          <Link to="/signup">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-2xl shadow">
              Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button className="text-yellow-600 font-semibold px-6 py-2 rounded-2xl border border-yellow-500">
              Log In
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-20">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            <strong>LandLink: Connect, Book & Manage Land Services in One Place</strong>
          </h1>
          <p className="text-lg text-gray-700">
            <b>
              From real estate surveyors to inspection teams, LandLink gives you a powerful dashboard, automated bookings,
              OTP-secure logins, and instant payments — in minutes.
            </b>
          </p>
          <div className="space-x-4">
            <Link to="/signup">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-2xl shadow">
                Start Free Trial
              </button>
            </Link>
            <Link to="/book-demo">
              <button className="border border-yellow-400 text-yellow-500 font-semibold px-6 py-3 rounded-2xl">
                Book a Demo
              </button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0">
          <video
            src="/assets/hero-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-[400px] object-cover rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 md:px-20 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Teams Love LandLink</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            {
              title: "OTP-Verified Logins",
              desc: "Secure access for clients and agents via email & SMS OTPs.",
            },
            {
              title: "Easy Booking Management",
              desc: "Track appointments and manage field tasks with ease.",
            },
            {
              title: "Integrated Payments",
              desc: "Accept payments via Paystack or M-Pesa instantly.",
            },
            {
              title: "Admin & Surveyor Dashboards",
              desc: "Role-based views to keep everyone productive.",
            },
          ].map((feature, i) => (
            <div key={i} className="bg-[#fff6e5] p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-8 md:px-20 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-700 italic">
              "It cut our booking time in half and made reporting automatic."
            </p>
            <p className="mt-4 font-semibold text-gray-800">— Titus Waweru., Site Manager</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-700 italic">
              "I can now track every agent and every payment without calling them."
            </p>
            <p className="mt-4 font-semibold text-gray-800">— Sarah M., Real Estate Ops Lead</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-16 bg-yellow-400 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to simplify your operations?</h2>
        <p className="mb-6">Start your free trial today — no credit card required.</p>
        <Link to="/signup">
          <button className="bg-white text-yellow-500 font-semibold px-6 py-3 rounded-2xl shadow">
            Get Started Free
          </button>
        </Link>
      </section>
    </div>
  );
}
