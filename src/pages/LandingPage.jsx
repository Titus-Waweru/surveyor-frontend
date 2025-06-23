import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";


export default function LandingPage() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleLinkClick = () => setIsNavOpen(false);

  // New PriceEstimator component inside LandingPage file for simplicity
  function PriceEstimator() {
    const [location, setLocation] = useState("urban");
    const [landSize, setLandSize] = useState("");
    const [service, setService] = useState("boundary");
    const [urgency, setUrgency] = useState("normal");
    const [estimate, setEstimate] = useState(null);

    // Pricing config (example base fees, modifiers)
    const basePrices = {
      boundary: 5000,
      topographic: 8000,
      gis: 10000,
      evaluation: 7000,
    };
    const locationModifiers = {
      urban: 1,
      semiurban: 1.2,
      remote: 1.5,
    };
    const urgencyModifiers = {
      normal: 1,
      express: 1.5,
    };

    // Calculate price dynamically
    useEffect(() => {
      const sizeNum = parseFloat(landSize);
      if (!sizeNum || sizeNum <= 0) {
        setEstimate(null);
        return;
      }

      const base = basePrices[service] || 5000;
      const locMod = locationModifiers[location] || 1;
      const urgMod = urgencyModifiers[urgency] || 1;

      // Formula: base * size * location modifier * urgency modifier
      const price = base * sizeNum * locMod * urgMod;
      setEstimate(price);
    }, [location, landSize, service, urgency]);

    return (
      <section
        className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-16 mb-20"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Estimate Your Survey Cost in Seconds
        </h2>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          aria-label="Price estimator form"
        >
          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-gray-700 font-semibold mb-2"
            >
              Location
            </label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-yellow-400"
            >
              <option value="urban">Urban</option>
              <option value="semiurban">Semi-Urban</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          {/* Land Size */}
          <div>
            <label
              htmlFor="landSize"
              className="block text-gray-700 font-semibold mb-2"
            >
              Land Size (acres)
            </label>
            <input
              type="number"
              id="landSize"
              min="0"
              step="0.01"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
              placeholder="Enter size"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-yellow-400"
              required
            />
          </div>

          {/* Service Type */}
          <div>
            <label
              htmlFor="service"
              className="block text-gray-700 font-semibold mb-2"
            >
              Survey Type
            </label>
            <select
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-yellow-400"
            >
              <option value="boundary">Boundary Survey</option>
              <option value="topographic">Topographic Survey</option>
              <option value="gis">GIS Mapping</option>
              <option value="evaluation">Land Evaluation</option>
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label
              htmlFor="urgency"
              className="block text-gray-700 font-semibold mb-2"
            >
              Urgency
            </label>
            <select
              id="urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-yellow-400"
            >
              <option value="normal">Normal</option>
              <option value="express">Express (+50%)</option>
            </select>
          </div>
        </form>

        {/* Estimate Display */}
        <div className="mt-8 text-center">
          {estimate !== null ? (
            <>
              <p className="text-xl font-semibold text-gray-800 mb-2">
                Estimated Price:
              </p>
              <p className="text-4xl font-bold text-yellow-500 mb-4">
                KES {estimate.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <button
                type="button"
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-8 py-3 rounded-2xl shadow transition"
                aria-label="Proceed to booking"
                onClick={() => alert("You can integrate booking flow here")}
              >
                Proceed to Book
              </button>
            </>
          ) : (
            <p className="text-gray-500">Enter all fields to see estimate</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <div className="bg-[#fff6e5] min-h-screen font-poppins">
      {/* ───────────────────────── Header ───────────────────────── */}
      <header className="px-4 sm:px-8 md:px-20 py-2 sm:py-3 bg-[#fff6e5] relative z-30">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <img
              src="/assets/logo.png"
              alt="LandLink Logo"
              className="h-[80px] md:h-[120px] w-auto object-contain"
            />
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link
              to="/home"
              className="font-bold text-black hover:text-[#7B4F24] transition-transform hover:scale-105"
            >
              Home
            </Link>
            <Link
              to="/contact"
              className="font-bold text-black hover:text-[#7B4F24] transition-transform hover:scale-105"
            >
              Contact&nbsp;Us
            </Link>
            <Link
              to="/news"
              className="font-bold text-black hover:text-[#7B4F24] transition-transform hover:scale-105"
            >
              News
            </Link>
            <Link
              to="/about"
              className="font-bold text-black hover:text-[#7B4F24] transition-transform hover:scale-105"
            >
              About&nbsp;Us
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-md hover:bg-yellow-400/20 transition-colors"
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            <Menu size={28} />
          </button>
        </div>

        {/* Mobile menu */}

        {isNavOpen && (
          <div className="md:hidden mt-4 bg-white shadow rounded-lg p-4">
            <Link
              to="/home"
              onClick={handleLinkClick}
              className="block py-2 font-bold text-black hover:text-[#7B4F24]"
            >
              Home
            </Link>
            <Link
              to="/contact"
              onClick={handleLinkClick}
              className="block py-2 font-bold text-black hover:text-[#7B4F24]"
            >
              Contact&nbsp;Us
            </Link>
            <Link
              to="/news"
              onClick={handleLinkClick}
              className="block py-2 font-bold text-black hover:text-[#7B4F24]"
            >
              News
            </Link>
            <Link
              to="/about"
              onClick={handleLinkClick}
              className="block py-2 font-bold text-black hover:text-[#7B4F24]"
            >
              About&nbsp;Us
            </Link>
          </div>
        )}
      </header>

{/* ──────────────────────── Hero Section ─────────────────────── */}
<section
  className="flex flex-col md:flex-row items-center justify-between
             px-4 sm:px-8 md:px-20 pt-8 sm:pt-10 pb-16 sm:pb-20
             overflow-x-hidden"    /* 👈 keep overflow clipped just here too */
>
  {/* Text column */}
  <div className="md:w-1/2 w-full space-y-6" data-aos="fade-up">
    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
      <strong>
        LandLink: Connect, Book &amp; Manage Land Services in One Place
      </strong>
    </h1>

    <p className="text-lg text-gray-700">
      From real estate surveyors to inspection teams, LandLink gives you a
    powerful dashboard, automated bookings OTP-secured logins, and

      instant payments -in minutes.
    </p>

    <div className="flex flex-wrap gap-4">
      <Link to="/signup">
        <button
          aria-label="Click here to Signup/Login"
          className="bg-yellow-400 hover:bg-yellow-500 text-white
                     font-semibold px-6 py-3 rounded-2xl shadow w-full
                     sm:w-auto"
        >
          <b>Signup/Login</b>
        </button>
      </Link>

      <Link to="/book-demo">
        <button
          aria-label="Book a Demo"
          className="border border-yellow-400 text-yellow-500
                     font-semibold px-6 py-3 rounded-2xl shadow w-full
                     sm:w-auto"
        >
          <b>Book a Demo</b>
        </button>
      </Link>
    </div>
  </div>

  {/* Swiper / image column */}
  <div
    className="md:w-1/2 w-full mt-12 md:mt-0"
    data-aos="zoom-in"
  >
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={30}
      pagination={{ clickable: true }}
      autoplay={{ delay: 8000 }}
      loop={true}
      className="w-full overflow-hidden rounded-xl shadow-lg"
    >
      {[
        "/assets/hero-image.jpg",
        "/assets/hero-image2.jpg",
        "/assets/hero-image3.jpg",
        "/assets/hero-image4.jpg",
        "/assets/hero-image5.jpg",
      ].map((src, i) => (
        <SwiperSlide key={i}>
          <img
            src={src}
            alt={`Slide ${i + 1}`}
            className="w-full h-64 sm:h-80 md:h-[400px] object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</section>


      {/* Insert PriceEstimator component here */}
      <PriceEstimator />

      {/* ─────────────── Vision, Mission, Goal Section ─────────────── */}
      <section
        className="px-4 sm:px-8 md:px-20 py-16 bg-white"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Our Vision, Mission & Goals
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-[#fff6e5] p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Vision</h3>
            <p className="text-gray-600">
              To be the leading digital infrastructure for land service automation
              across Africa.
            </p>
          </div>
          <div className="bg-[#fff6e5] p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Mission</h3>
            <p className="text-gray-600">
              To empower individuals and organizations with easy-to-use tools for
              booking, managing, and completing land-related services.
            </p>
          </div>
          <div className="bg-[#fff6e5] p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Goal</h3>
            <p className="text-gray-600">
              Seamlessly connect clients, surveyors, GIS Experts and administrators while
              enhancing transparency, speed, and trust in land service delivery.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────── Services Section ───────────────────── */}
      <section
        className="px-4 sm:px-8 md:px-20 py-16 bg-[#fff6e5]"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          What We Offer
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[...Array(9).keys()].map((index) => {
            const services = [
              {
                name: "Land Surveying",
                desc:
                  "Professional surveys for boundary marking, subdivision, and land development with precision and compliance.",
              },
              {
                name: "Site Inspection Scheduling",
                desc:
                  "Easily book, manage, and track on-site inspections — all from your dashboard in real time.",
              },
              {
                name: "Title Deed Verification",
                desc:
                  "Instantly verify title deeds through integrated systems — avoid fraud, ensure peace of mind.",
              },
              {
                name: "Agent Tracking & Reporting",
                desc:
                  "Monitor agent movements, performance, and field activity — complete with smart reporting tools.",
              },
              {
                name: "Real-Time Job Monitoring",
                desc:
                  "Track every job’s progress, location, and status in real time — no more guesswork or delays.",
              },
              {
                name: "Mobile OTP-Verified Access",
                desc:
                  "Secure logins with email & SMS OTP — keeping your team and data safe at every step.",
              },
              {
                name: "GIS Expert Services",
                desc:
                  "Tap into advanced GIS mapping & spatial analysis for land use planning, zoning, and terrain modeling.",
              },
              {
                name: "Real Estate Services",
                desc:
                  "From listings to lead management, connect with verified agents & streamline your land sales process.",
              },
              {
                name: "Land Evaluation Services",
                desc:
                  "Get expert valuation reports to determine fair land pricing — ideal for investment, sales, or taxation.",
              },
            ];
            const service = services[index];
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────── Features Section ───────────────────── */}
      <section
        className="px-4 sm:px-8 md:px-20 py-16 bg-white"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Teams Love LandLink
        </h2>
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
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600">{descs[i]}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────── Testimonials ──────────────────────── */}
      <section className="px-4 sm:px-8 md:px-20 py-16" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          What Our Users Say
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-700 italic">
              "It cut our booking time in half and made reporting automatic."
            </p>
            <p className="mt-4 font-semibold text-gray-800">
              — Samuel Waweru., Landcave CEO
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-700 italic">
              "I can now track every agent and every payment without calling
              them."
            </p>
            <p className="mt-4 font-semibold text-gray-800">
              — Sarah M., Real Estate Ops Lead
            </p>
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

  {/* Social & Hours Block */}
  <div className="mt-10 bg-white bg-opacity-10 rounded-xl px-6 py-8 max-w-2xl mx-auto text-sm text-white">
    {/* Social Media */}
    <div className="mb-4">
      <p className="font-semibold text-lg mb-2">📱 Follow Us:</p>
      <div className="flex justify-center gap-4 flex-wrap">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-100">Facebook</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-100">X (Twitter)</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-100">Instagram</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-100">LinkedIn</a>
      </div>
    </div>

    {/* Working Hours */}
    <div>
      <p className="font-semibold text-lg mb-2">🕒 Working Hours:</p>
      <p>Monday – Friday: 8:00 AM – 6:00 PM</p>
      <p>Saturday: 9:00 AM – 1:00 PM</p>
      <p>Sunday & Public Holidays: Closed</p>
    </div>
  </div>
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

