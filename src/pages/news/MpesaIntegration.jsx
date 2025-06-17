// src/pages/news/MpesaIntegration.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function MpesaIntegration() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#fff6e5] min-h-screen font-manrope px-6 py-16">
      {/* Breadcrumb */}
      <Link to="/news" className="text-yellow-600 hover:underline text-sm">
        ← Back to News
      </Link>

      {/* Article Card */}
      <article
        data-aos="fade-up"
        className="max-w-3xl mx-auto mt-6 bg-white p-8 rounded-2xl shadow-lg"
      >
        {/* Hero */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            Instant Payments: LandLink <span className="text-yellow-600">+ M‑Pesa</span>
          </h1>
          <p className="text-sm text-gray-500">May 20,2025 • 4-min read</p>
          <img
            src="/assets/mpesa-hero.jpg"
            alt="Mobile payment illustration"
            className="w-full h-56 sm:h-72 md:h-80 object-cover rounded-xl mt-6 shadow"
          />
        </header>

        {/* Introduction */}
        <section className="leading-relaxed text-lg text-gray-700 space-y-6">
          <p>
            <strong className="text-yellow-600">Today we’re closing the payment gap.</strong> By integrating M‑Pesa—the most trusted mobile wallet in East Africa—LandLink now lets clients confirm bookings in seconds, directly from their phones.
          </p>

          {/* Key Benefits */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-5">
            <h2 className="font-semibold text-gray-800 mb-2">Why it matters</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><b>Zero friction:</b> Pay and get instant confirmation without leaving LandLink.</li>
              <li><b>Trust by default:</b> Clients know—and love—M‑Pesa’s security.</li>
              <li><b>Faster cash‑flow:</b> Surveyors receive deposits sooner, reducing cancellations.</li>
            </ul>
          </div>

          {/* How it works */}
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3">
            How the integration works
          </h2>
          <ol className="list-decimal list-inside space-y-2 pl-1">
            <li>Choose your service and tap <em>“Pay with M-Pesa”</em>.</li>
            <li>Enter your phone number; a prompt appears instantly.</li>
            <li>Confirm the amount, enter your PIN, and you're done—no extra fees.</li>
          </ol>

          {/* Social proof / Quote */}
          <blockquote
            className="border-l-4 border-yellow-400 pl-4 italic text-gray-600 my-8"
          >
            “Mobile money transformed Kenyan commerce. LandLink’s M‑Pesa integration now brings that speed and trust to land services.”
            <br />
            <span className="not-italic font-semibold text-gray-800">
              — Jane K., Real-Estate Analyst
            </span>
          </blockquote>

          {/* Impact */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            What this means for you
          </h2>
          <p>
            <span className="font-semibold">Clients:</span> no more bank queues or paperwork—just tap, pay, and book.
          </p>
          <p>
            <span className="font-semibold">Surveyors:</span> fewer cancellations, transparent payouts, and a reputation boost for embracing digital convenience.
          </p>

          {/* CTA */}
          <div className="text-center mt-10">
            <Link
              to="/signup"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-2xl shadow transition"
            >
              Try it now—book your next survey in minutes
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
