// ───────────── src/components/pages/MichaelOtieno.jsx ─────────────
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function MichaelOtieno() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#fff6e5] min-h-screen font-poppins text-gray-800">
      <div className="px-4 sm:px-8 md:px-20 py-16">
        <Link
          to="/about"
          className="inline-flex items-center text-sm text-yellow-600 hover:underline mb-6"
        >
          ← Back to About Us
        </Link>

        <div
          className="flex flex-col md:flex-row items-center gap-10 bg-white rounded-2xl shadow p-8"
          data-aos="fade-up"
        >
          <img
            src="/assets/michael.JPG"
            alt="Michael Otieno"
            className="w-[220px] h-[220px] rounded-full object-cover shadow-lg"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Michael Otieno</h1>
            <p className="text-yellow-600 font-semibold mb-4">Lead Engineer</p>
            <p className="leading-relaxed text-lg">
              Michael architects and scales LandLink's technology stack. He is
              passionate about clean code, robust infrastructure, and creating
              delightful developer experiences. His expertise spans cloud‑native
              services, CI/CD pipelines, and security best practices.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 text-center">
              {[
                ["1M+", "Lines of Code"],
                ["99.9%", "Uptime"],
                ["7", "Tech Certifications"],
              ].map(([stat, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-yellow-600">{stat}</p>
                  <p className="text-sm text-gray-600">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-4">
              <a
                href="https://linkedin.com/in/michaelotieno"
                target="_blank"
                rel="noreferrer"
                className="text-yellow-600 hover:underline text-sm"
              >
                LinkedIn
              </a>
              <a
                href="mailto:michael@landlink.co.ke"
                className="text-yellow-600 hover:underline text-sm"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        <section className="mt-12" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-4">Technical Toolbox</h2>
          <ul className="list-disc list-inside leading-relaxed text-lg space-y-2">
            <li>React, Node.js, PostgreSQL &amp; Prisma</li>
            <li>AWS, Docker, Kubernetes</li>
            <li>DevOps &amp; security best practices</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
