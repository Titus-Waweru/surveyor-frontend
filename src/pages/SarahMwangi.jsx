// ───────────── src/components/pages/SarahMwangi.jsx ─────────────
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function SarahMwangi() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#fff6e5] min-h-screen font-poppins text-gray-800">
      <div className="px-4 sm:px-8 md:px-20 py-16">
        <div
          className="flex flex-col md:flex-row items-center gap-10 bg-white rounded-2xl shadow p-8"
          data-aos="fade-up"
        >
          <img
            src="/assets/sarah.jpg"
            alt="Sarah Mwangi"
            className="w-[220px] h-[220px] rounded-full object-cover shadow-lg"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Sarah Mwangi</h1>
            <p className="text-yellow-600 font-semibold mb-4">Operations Lead</p>
            <p className="leading-relaxed text-lg">
              Sarah oversees day‑to‑day operations at LandLink, ensuring every
              booking is handled efficiently and every client is delighted.
              With a background in logistics and agile project management, she
              brings structure and heart to a fast‑growing tech environment.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 text-center">
              {[
                ["8+", "Years in Ops"],
                ["500+", "Projects Managed"],
                ["98%", "Client Satisfaction"],
              ].map(([stat, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-yellow-600">{stat}</p>
                  <p className="text-sm text-gray-600">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-4">
              <a
                href="https://linkedin.com/in/sarahmwangi"
                target="_blank"
                rel="noreferrer"
                className="text-yellow-600 hover:underline text-sm"
              >
                LinkedIn
              </a>
              <a
                href="mailto:sarah@landlink.co.ke"
                className="text-yellow-600 hover:underline text-sm"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        <section className="mt-12" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-4">Core Strengths</h2>
          <ul className="list-disc list-inside leading-relaxed text-lg space-y-2">
            <li>Process optimisation &amp; quality assurance</li>
            <li>Team leadership and mentorship</li>
            <li>Customer success management</li>
          </ul>
        </section>
      </div>
    </div>
  );
}