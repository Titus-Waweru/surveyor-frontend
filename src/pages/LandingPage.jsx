import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function LandingPage() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleLinkClick = () => setIsNavOpen(false);

  return (
    <div className="bg-[#fff6e5] min-h-screen font-poppins">
      {/* ───────────────────────── Header ───────────────────────── */}
      <header className="relative px-4 sm:px-8 md:px-20 py-4 sm:py-6">
        {/* Logo + hamburger */}
        <div className="flex items-center justify-between">
          <Link to="/">
            <img
              src="/assets/logo.png"
              alt="LandLink Logo"
              className="h-[100px] md:h-[150px] w-auto max-w-[270px] object-contain"
            />
          </Link>

          {/* Mobile toggle button */}
          <button
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-md hover:bg-yellow-400/20 transition-colors"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            <Menu size={28} />
          </button>
        </div>

        {/* Navigation links */}
        <nav
          className={`${
            isNavOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-start md:items-center absolute md:static top-[100%] left-0 w-full md:w-auto bg-[#fff6e5] md:bg-transparent shadow-md md:shadow-none z-20`}
        >
          <Link
            to="/home"
            onClick={handleLinkClick}
            className="font-bold text-black px-6 py-3 border-b md:border-b-0 md:border-r border-gray-400 hover:text-[#7B4F24] transition-transform duration-300 transform hover:scale-105"
          >
            Home
          </Link>
          <Link
            to="/contact"
            onClick={handleLinkClick}
            className="font-bold text-black px-6 py-3 border-b md:border-b-0 md:border-r border-gray-400 hover:text-[#7B4F24] transition-transform duration-300 transform hover:scale-105"
          >
            Contact&nbsp;Us
          </Link>
          <Link
            to="/news"
            onClick={handleLinkClick}
            className="font-bold text-black px-6 py-3 border-b md:border-b-0 md:border-r border-gray-400 hover:text-[#7B4F24] transition-transform duration-300 transform hover:scale-105"
          >
            News
          </Link>
          <Link
            to="/about"
            onClick={handleLinkClick}
            className="font-bold text-black px-6 py-3 hover:text-[#7B4F24] transition-transform duration-300 transform hover:scale-105"
          >
            About&nbsp;Us
          </Link>
        </nav>
      </header>

      {/* ──────────────────────── Hero Section ─────────────────────── */}
      <section className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-20 py-16 sm:py-20">
        <div className="md:w-1/2 space-y-6" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            <strong>LandLink: Connect, Book & Manage Land Services in One Place</strong>
          </h1>
          <p className="text-lg text-gray-700">
            From real estate surveyors to inspection teams, LandLink gives you a powerful dashboard, automated bookings,
            OTP-secure logins, and instant payments — in minutes.
          </p>
          <div className="space-x-4">
            <Link to="/signup">
              <button
                aria-label="Click here to Signup/Login"
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-2xl shadow"
              >
                <b>Signup/Login</b>
              </button>
            </Link>
            <Link to="/book-demo">
  <button
    aria-label="Book a Demo"
    className="border border-yellow-400 text-yellow-500 font-semibold px-6 py-3 rounded-2xl shadow"
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

      {/* ─────────────── Vision, Mission, Goal Section ─────────────── */}
      <section className="px-4 sm:px-8 md:px-20 py-16 bg-white" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Vision, Mission & Goals</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-[#fff6e5] p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Vision</h3>
            <p className="text-gray-600">
              To be the leading digital infrastructure for land service automation across Africa.
            </p>
          </div>
          <div className="bg-[#fff6e5] p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Mission</h3>
            <p className="text-gray-600">
              To empower individuals and organizations with easy-to-use tools for booking, managing, and completing
              land-related services.
            </p>
          </div>
          <div className="bg-[#fff6e5] p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Goal</h3>
            <p className="text-gray-600">
              Seamlessly connect clients, surveyors, and administrators while enhancing transparency, speed, and trust
              in land service delivery.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────── Services Section ───────────────────── */}
      <section className="px-4 sm:px-8 md:px-20 py-16 bg-[#fff6e5]" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What We Offer</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[...Array(9).keys()].map((index) => {
            const services = [
              { name: "Land Surveying", desc: "Professional surveys for boundary marking, subdivision, and land development with precision and compliance." },
              { name: "Site Inspection Scheduling", desc: "Easily book, manage, and track on-site inspections — all from your dashboard in real time." },
              { name: "Title Deed Verification", desc: "Instantly verify title deeds through integrated systems — avoid fraud, ensure peace of mind." },
              { name: "Agent Tracking & Reporting", desc: "Monitor agent movements, performance, and field activity — complete with smart reporting tools." },
              { name: "Real-Time Job Monitoring", desc: "Track every job’s progress, location, and status in real time — no more guesswork or delays." },
              { name: "Mobile OTP-Verified Access", desc: "Secure logins with email & SMS OTP — keeping your team and data safe at every step." },
              { name: "GIS Expert Services", desc: "Tap into advanced GIS mapping & spatial analysis for land use planning, zoning, and terrain modeling." },
              { name: "Real Estate Services", desc: "From listings to lead management, connect with verified agents & streamline your land sales process." },
              { name: "Land Evaluation Services", desc: "Get expert valuation reports to determine fair land pricing — ideal for investment, sales, or taxation." },
            ];
            const service = services[index];
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────── Features Section ───────────────────── */}
      <section className="px-4 sm:px-8 md:px-20 py-16 bg-white" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Teams Love LandLink</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            "OTP-Verified Logins",
            "Easy Booking Management",
            "Integrated Payments",
            "Admin & Surveyor Dashboards",
          ].map((title, i) => {
            const descs = [
              "Secure access for clients and agents via email & SMS OTPs.",
              "Track appointments and manage field tasks with ease.",
              "Accept payments via Paystack or M-Pesa instantly.",
              "Role-based views to keep everyone productive.",
            ];
            return (
              <div
                key={i}
                className="bg-[#fff6e5] p-6 rounded-2xl shadow"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600">{descs[i]}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────── Testimonials ──────────────────────── */}
      <section className="px-4 sm:px-8 md:px-20 py-16" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-700 italic">
              "It cut our booking time in half and made reporting automatic."
            </p>
            <p className="mt-4 font-semibold text-gray-800">— Samuel Waweru., Landcave CEO</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-700 italic">
              "I can now track every agent and every payment without calling them."
            </p>
            <p className="mt-4 font-semibold text-gray-800">— Sarah M., Real Estate Ops Lead</p>
          </div>
        </div>
      </section>

      {/* ────────────────── Final Call to Action ───────────────────── */}
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

      {/* ───────────────────────── Footer ─────────────────────────── */}
      <footer className="bg-white py-6 px-4 sm:px-8 md:px-20 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} LandLink. All rights reserved.{" "}
          <Link to="/terms" className="text-yellow-600 hover:underline ml-1">
            Terms &amp; Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}
