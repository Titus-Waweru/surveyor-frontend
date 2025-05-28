import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function LandingPage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#fff6e5] min-h-screen font-poppins">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-8 md:px-20 py-4 sm:py-6">
        <Link to="/">
          <img
            src="/assets/logo.png"
            alt="LandLink Logo"
            className="h-[100px] md:h-[150px] w-auto max-w-[270px] object-contain"
          />
        </Link>
        <div className="space-x-4 hidden md:block">
          <Link to="/signup">
            <button
              aria-label="Sign Up"
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-2xl shadow"
            >
              Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button
              aria-label="Log In"
              className="text-yellow-600 font-semibold px-6 py-2 rounded-2xl border border-yellow-500"
            >
              Log In
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-20 py-16 sm:py-20">
        <div className="md:w-1/2 space-y-6" data-aos="fade-up">
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
              <button
                aria-label="Start Free Trial"
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-2xl shadow"
              >
                <b>Start Free Trial</b>
              </button>
            </Link>
            <Link to="/book-demo">
              <button
                aria-label="Book a Demo"
                className="border border-yellow-400 text-yellow-500 font-semibold px-6 py-3 rounded-2xl"
              >
                <b>Book a Demo</b>
              </button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0" data-aos="zoom-in">
          <img
            src="/assets/hero-image.jpg"
            alt="LandLink dashboard preview"
            className="w-full h-[400px] object-cover rounded-xl shadow-lg"
            loading="lazy"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-8 md:px-20 py-16 bg-white" data-aos="fade-up">
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
            <div key={i} className="bg-[#fff6e5] p-6 rounded-2xl shadow" data-aos="fade-up" data-aos-delay={i * 100}>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 sm:px-8 md:px-20 py-16" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-700 italic">
              "It cut our booking time in half and made reporting automatic."
            </p>
            <p className="mt-4 font-semibold text-gray-800">— Titus Waweru.,  LandLink CEO</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-700 italic">
              "I can now track every agent and every payment without calling them."
            </p>
            <p className="mt-4 font-semibold text-gray-800">— Sarah M., Real Estate Ops Lead</p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="text-center py-16 bg-yellow-400 text-white" data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-4">Ready to simplify your operations?</h2>
        <p className="mb-6">Start your free trial today — no credit card required.</p>
        <Link to="/signup">
          <button
            aria-label="Get Started Free"
            className="bg-white text-yellow-500 font-semibold px-6 py-3 rounded-2xl shadow"
          >
            <b>Get Started Free</b>
          </button>
        </Link>
      </section>
    </div>
  );
}
