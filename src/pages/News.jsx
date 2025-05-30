import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function InfoAlert() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="max-w-4xl mx-auto mb-8 p-5 rounded-xl bg-yellow-100 border-l-8 border-yellow-400 shadow-md cursor-pointer select-none"
      data-aos="fade-down"
      role="alert"
      onClick={() => setVisible(false)}
      title="Click to dismiss"
    >
      <strong className="text-yellow-800 font-bold block mb-1 text-lg">
        Important Notice!
      </strong>
      <p className="text-yellow-900 leading-relaxed">
        To book a service on LandLink, customers are required to pay a small booking fee upfront to secure their appointment.
        <br />
        <br />
        Similarly, surveyors must also pay a nominal charge to connect with potential clients and maintain service quality.
        <br />
        <br />
        <em className="font-semibold">Tap this box to dismiss this message.</em>
      </p>
    </div>
  );
}

export default function News() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#fff6e5] min-h-screen font-manrope px-4 sm:px-8 md:px-20 py-16">
      {/* Info Alert */}
      <InfoAlert />

      {/* Page Header */}
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Latest News & Updates</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Stay informed about land regulations, industry trends, and what’s new at LandLink.
        </p>
      </div>

      {/* News Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="100">
        {[
          {
            title: "LandLink Now Integrates M-Pesa",
            date: "May 20, 2025",
            summary:
              "We’re excited to announce full M-Pesa integration, making it easier for clients to make secure payments instantly.",
          },
          {
            title: "Government Issues New Land Survey Regulations",
            date: "May 5, 2025",
            summary:
              "The Ministry of Lands has updated policies affecting how land boundaries are surveyed and documented.",
          },
          {
            title: "New Surveyor Tools Added",
            date: "April 25, 2025",
            summary:
              "Surveyors can now upload geotagged reports directly via their dashboards, improving efficiency and accuracy.",
          },
        ].map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow" data-aos="fade-up" data-aos-delay={index * 100}>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{item.date}</p>
            <p className="text-gray-600">{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
