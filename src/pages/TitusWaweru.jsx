// ───────────── src/components/pages/TitusWaweru.jsx ─────────────
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function TitusWaweru() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#fff6e5] min-h-screen font-poppins text-gray-800">
      <div className="px-4 sm:px-8 md:px-20 py-16">
        {/* Hero */}
        <div
          className="flex flex-col md:flex-row items-center gap-10 bg-white rounded-2xl shadow p-8"
          data-aos="fade-up"
        >
          <img
            src="/assets/titus.jpg"
            alt="Titus Waweru"
            className="w-[220px] h-[220px] rounded-full object-cover shadow-lg"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Titus Waweru</h1>
            <p className="text-yellow-600 font-semibold mb-4">Founder & CEO</p>
            <p className="leading-relaxed text-lg">
              Titus is a visionary entrepreneur and software engineer with a
              decade of experience building geospatial platforms for the East
              African market. At LandLink, he drives strategy, product vision,
              and partnerships—ensuring the company remains at the forefront of
              innovation in digital land services.
            </p>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 text-center">
              {[
                ["4+", "Years in Tech"],
                ["3", "Products Launched"],
                ["3", "Industry Awards"],
                ["6084", "Isk no, GIS Chapter"]
              ].map(([stat, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-yellow-600">{stat}</p>
                  <p className="text-sm text-gray-600">{label}</p>
                </div>
              ))}
            </div>
            {/* Social */}
            <div className="mt-6 flex gap-4">
              <a
                href="https://linkedin.com/in/tituswaweru"
                target="_blank"
                rel="noreferrer"
                className="text-yellow-600 hover:underline text-sm"
              >
                LinkedIn
              </a>
              <a
                href="mailto:titus@landlink.co.ke"
                className="text-yellow-600 hover:underline text-sm"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Expertise & Vision */}
        <section className="mt-12" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-4">Expertise</h2>
          <ul className="list-disc list-inside leading-relaxed text-lg space-y-2">
            <li>Geospatial system architecture &amp; GIS integrations</li>
            <li>Full‑stack development (React, Node, PostgreSQL)</li>
            <li>Product strategy &amp; startup leadership</li>
            <li>Isk No: 6084 &amp; startup leadership</li>
          </ul>
        </section>
      </div>
    </div>
  );
}