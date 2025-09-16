import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaBullhorn, FaMobileAlt, FaGavel, FaTools } from "react-icons/fa";
import { Link } from "react-router-dom";

/* ─────────────────────────── Info Alert ─────────────────────────── */
function InfoAlert() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="max-w-4xl mx-auto mb-8 p-5 rounded-xl bg-yellow-100 border-l-8 border-yellow-400 shadow-md cursor-pointer select-none"
      data-aos="fade-down"
      role="alert"
      aria-live="assertive"
      onClick={() => setVisible(false)}
      title="Click to dismiss"
    >
      <strong className="text-yellow-800 font-bold block mb-2 text-lg flex items-center gap-2">
        <FaBullhorn className="text-yellow-600" aria-hidden="true" /> Important Update
      </strong>
      <p className="text-yellow-900 leading-relaxed text-sm sm:text-base">
        Booking a service with{" "}
        <span className="font-bold text-yellow-700">LandLink</span> now requires
        a small fee to confirm your spot. This ensures reliability and fairness
        for both clients and surveyors.
        <br />
        <br />
        Surveyors also contribute a small access fee to maintain top-tier service quality.
        <br />
        <br />
        <em className="font-semibold">Tap this message to close it.</em>
      </p>
    </div>
  );
}

/* ─────────────────────────── News Component ─────────────────────────── */
export default function News() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const newsData = [
    {
      icon: <FaMobileAlt className="text-yellow-500 text-3xl" aria-hidden="true" />,
      title: "M-Pesa Integration: Pay in Seconds",
      date: "May 20, 2025",
      summary:
        "We’ve officially launched M-Pesa for fast, secure transactions. Say goodbye to delays and hello to convenience.",
      link: "/news/mpesa-integration",
    },
    {
      icon: <FaGavel className="text-yellow-500 text-3xl" aria-hidden="true" />,
      title: "New Government Survey Laws Explained",
      date: "May 5, 2025",
      summary:
        "The Ministry of Lands introduced critical new guidelines. Understand what’s changed and how it affects you.",
      link: "/news/land-regulations",
    },
    {
      icon: <FaTools className="text-yellow-500 text-3xl" aria-hidden="true" />,
      title: "Smart Tools for Smart Surveyors",
      date: "April 25, 2025",
      summary:
        "We’ve rolled out powerful dashboard features. Learn how to use real-time uploads to boost your credibility.",
      link: "/news/surveyor-tools",
    },
  ];

  return (
    <main className="bg-[#fff6e5] min-h-screen font-manrope px-4 sm:px-8 md:px-20 py-16">
      {/* Back to Home */}
      <Link
        to="/"
        className="inline-flex items-center text-sm text-yellow-600 hover:underline mb-6"
        aria-label="Go back to homepage"
      >
        ← Back to Home
      </Link>

      {/* Info Alert */}
      <InfoAlert />

      {/* News Header */}
      <header className="text-center mb-12" data-aos="fade-up">
        <h1
          id="news-heading"
          className="text-4xl font-extrabold text-gray-800 mb-3 flex items-center justify-center gap-2"
        >
          <FaBullhorn className="text-yellow-500" aria-hidden="true" />
          News & Insights
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Stay ahead in the world of land and property. Here’s what’s new,
          changing, and worth your attention at{" "}
          <span className="text-yellow-600 font-semibold">LandLink</span>.
        </p>
      </header>

      {/* News Grid */}
      <section
        aria-labelledby="news-heading"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        {newsData.map((item, index) => (
          <article
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-yellow-100 will-change-transform"
            data-aos="fade-up"
            data-aos-delay={index * 150}
            aria-labelledby={`news-title-${index}`}
          >
            <div className="mb-4">{item.icon}</div>
            <h2
              id={`news-title-${index}`}
              className="text-xl font-semibold text-gray-800 mb-1"
            >
              {item.title}
            </h2>
            <p className="text-sm text-gray-500 mb-2">{item.date}</p>
            <p className="text-gray-700 mb-4 text-sm sm:text-base">{item.summary}</p>
            <Link
              to={item.link}
              className="inline-block text-sm font-medium text-yellow-600 hover:text-yellow-800 transition-colors duration-150"
              aria-label={`Read full article: ${item.title}`}
            >
              Read full article →
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
