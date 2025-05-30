import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#fff6e5] min-h-screen font-manrope px-4 sm:px-8 md:px-20 py-16">
      {/* Welcome Header */}
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to LandLink</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Your trusted platform for land verification and survey services. We connect property owners, surveyors, and professionals with seamless booking, secure payments, and easy management — all in one place.
        </p>
      </div>

      {/* Key Features Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-10" data-aos="fade-up" data-aos-delay="100">
        {[
          {
            title: "Reliable Land Verification",
            desc: "Ensure your property boundaries are accurate and legally compliant.",
          },
          {
            title: "Streamlined Booking System",
            desc: "Schedule surveyor appointments effortlessly through our dashboard.",
          },
          {
            title: "Secure & Instant Payments",
            desc: "Use Paystack or M-Pesa to pay securely and quickly for services.",
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
