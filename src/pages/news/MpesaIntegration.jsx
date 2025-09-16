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
    <main className="bg-[#fff6e5] min-h-screen font-manrope px-4 sm:px-8 md:px-20 py-16">
      {/* Breadcrumb */}
      <Link
        to="/news"
        className="inline-flex items-center text-sm text-yellow-600 hover:underline mb-6"
        aria-label="Back to News"
      >
        ← Back to News
      </Link>

      {/* Article */}
      <article
        data-aos="fade-up"
        className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-lg"
      >
        {/* Hero */}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-snug mb-3">
            Instant Payments: LandLink{" "}
            <span className="text-yellow-600">+ M-Pesa</span>
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            May 20, 2025 • 4-min read
          </p>
          <img
            src="/assets/Mpesa.png"
            alt="Illustration of M-Pesa mobile payment integration"
            className="w-full h-52 sm:h-72 md:h-80 object-cover rounded-xl shadow-md"
            loading="lazy"
          />
        </header>

        {/* Body */}
        <section className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          {/* Introduction */}
          <p>
            <strong className="text-yellow-600">
              Today we’re closing the payment gap.
            </strong>{" "}
            By integrating M-Pesa—the most trusted mobile wallet in East
            Africa—LandLink now lets clients confirm bookings in seconds,
            directly from their phones.
          </p>

          {/* Key Benefits */}
          <div
            className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-5 my-8 shadow-sm"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2 className="font-semibold text-gray-800 mb-3 text-lg">
              Why it matters
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <b>Zero friction:</b> Pay and get instant confirmation without
                leaving LandLink.
              </li>
              <li>
                <b>Trust by default:</b> Clients know—and love—M-Pesa’s
                security.
              </li>
              <li>
                <b>Faster cash-flow:</b> Surveyors receive deposits sooner,
                reducing cancellations.
              </li>
            </ul>
          </div>

          {/* How it works */}
          <h2
            className="text-2xl font-bold text-gray-800 mt-8 mb-3"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            How the integration works
          </h2>
          <ol className="list-decimal list-inside space-y-2 pl-1">
            <li>
              Choose your service and tap{" "}
              <em className="text-yellow-700">“Pay with M-Pesa”</em>.
            </li>
            <li>Enter your phone number; a prompt appears instantly.</li>
            <li>
              Confirm the amount, enter your PIN, and you're done—no extra fees.
            </li>
          </ol>

          {/* Quote */}
          <blockquote
            className="border-l-4 border-yellow-400 pl-4 italic text-gray-600 my-8"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            “Mobile money transformed Kenyan commerce. LandLink’s M-Pesa
            integration now brings that speed and trust to land services.”
            <br />
            <span className="not-italic font-semibold text-gray-800 block mt-2">
              — Jane K., Real-Estate Analyst
            </span>
          </blockquote>

          {/* Impact */}
          <h2
            className="text-2xl font-bold text-gray-800 mb-3"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            What this means for you
          </h2>
          <p>
            <span className="font-semibold">Clients:</span> no more bank queues
            or paperwork—just tap, pay, and book.
          </p>
          <p>
            <span className="font-semibold">Surveyors:</span> fewer
            cancellations, transparent payouts, and a reputation boost for
            embracing digital convenience.
          </p>

          {/* CTA */}
          <div
            className="text-center mt-10"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <Link
              to="/signup"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-md transition-colors duration-200"
            >
              Try it now—book your next survey in minutes
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
