// src/pages/news/SurveyorTools.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function SurveyorTools() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#fff6e5] min-h-screen font-manrope px-6 py-16">
      {/* Breadcrumb */}
      <Link to="/news" className="text-yellow-600 hover:underline text-sm">
        ← Back to News
      </Link>

      <article
        data-aos="fade-up"
        className="max-w-3xl mx-auto mt-6 bg-white p-8 rounded-2xl shadow-lg"
      >
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            Smarter Workflow: New <span className="text-yellow-600">Surveyor Tools</span>
          </h1>
          <p className="text-sm text-gray-500">April 25, 2025 • 4-min read</p>
          <img
            src="/assets/surveyor-tools.jpg"
            alt="Surveyor dashboard screenshot"
            className="w-full h-56 sm:h-72 md:h-80 object-cover rounded-xl mt-6 shadow"
          />
        </header>

        {/* Introduction */}
        <section className="leading-relaxed text-lg text-gray-700 space-y-6">
          <p>
            Fieldwork just got easier. LandLink’s latest release lets surveyors upload <strong>geo‑tagged reports</strong> directly from the job
            site—speeding up documentation and boosting client confidence.
          </p>

          {/* Feature Highlights */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-5">
            <h2 className="font-semibold text-gray-800 mb-2">Key Benefits</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><b>Real-time tracking:</b> See each job update on the map instantly.</li>
              <li><b>Proof of presence:</b> Geo-tags verify you were on site—no disputes.</li>
              <li><b>Time saved:</b> Upload once; the report auto syncs to the client dashboard.</li>
            </ul>
          </div>

          {/* How-To Steps */}
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3">
            3‑Step Quick Start
          </h2>
          <ol className="list-decimal list-inside space-y-2 pl-1">
            <li>Open the job card and tap <em>“Add Report”</em>.</li>
            <li>Snap photos or attach documents—GPS tags are captured automatically.</li>
            <li>Submit. Clients receive a notification and can view details instantly.</li>
          </ol>

          {/* Testimonial */}
          <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-gray-600 my-8">
            “The geo-tagged uploads cut our paperwork time by 40 %. Clients love the transparency.”
            <br />
            <span className="not-italic font-semibold text-gray-800">
              — Peter M., Registered Surveyor
            </span>
          </blockquote>

          {/* Impact */}
          <p>
            These tools exemplify our commitment to empower professionals across Kenya’s land service ecosystem. Expect even more workflow automations soon.
          </p>

          {/* CTA */}
          <div className="text-center mt-10">
            <Link
              to="/login"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-2xl shadow transition"
            >
              Log in & try it today
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
