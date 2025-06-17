// src/pages/news/LandRegulations.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function LandRegulations() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#fff6e5] min-h-screen font-manrope px-6 py-16">
      {/* Back Link */}
      <Link to="/news" className="text-yellow-600 hover:underline text-sm">
        ← Back to News
      </Link>

      {/* Article Content */}
      <article
        data-aos="fade-up"
        className="max-w-3xl mx-auto mt-6 bg-white p-8 rounded-2xl shadow-lg"
      >
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            Kenya’s New Land Survey Regulations: What You Must Know
          </h1>
          <p className="text-sm text-gray-500">May 5, 2025 • 5‑min read</p>
          <img
            src="/assets/land-regulation.jpg"
            alt="Surveyors at work"
            className="w-full h-56 sm:h-72 md:h-80 object-cover rounded-xl mt-6 shadow"
          />
        </header>

        {/* Overview */}
        <section className="leading-relaxed text-lg text-gray-700 space-y-6">
          <p>
            The Ministry of Lands has announced new survey regulations aimed at
            enhancing land boundary accuracy, curbing fraudulent titles, and strengthening public trust in land transactions.
            These reforms mark a critical shift in Kenya’s approach to land governance.
          </p>

          {/* Key Highlights */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-5">
            <h2 className="font-semibold text-gray-800 mb-2">
              Key Changes to Expect
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Mandatory use of certified geospatial tools by all surveyors</li>
              <li>Updated procedures for resolving boundary disputes</li>
              <li>Required digital submission of land reports to national systems</li>
              <li>Audits on existing survey records for compliance</li>
            </ul>
          </div>

          {/* Quote / Authority */}
          <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-gray-600 my-8">
            “This is a major leap toward eliminating the guesswork in Kenya’s land sector. It will benefit buyers, landowners, and professionals alike.”
            <br />
            <span className="not-italic font-semibold text-gray-800">
              — Dr. Mercy Kariuki, Commissioner of Lands
            </span>
          </blockquote>

          {/* Impact Section */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            What This Means for LandLink Surveyors
          </h2>
          <p>
            All registered surveyors on LandLink are now expected to align with
            the Ministry’s new guidelines. Our platform will provide clear checklists, training materials, and updated submission workflows to support this transition.
          </p>
          <p>
            Compliance will not only ensure you stay legally protected but also boost your credibility and ranking on LandLink.
          </p>

          {/* Guidance CTA */}
          <div className="text-center mt-10">
            <Link
              to="/dashboard/resources"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-2xl shadow transition"
            >
              View Surveyor Resources →
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
