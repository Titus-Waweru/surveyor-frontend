import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <>
      <Helmet>
        <title>LandLink - Trusted Land Verification & Survey Booking in Kenya</title>
        <meta
          name="description"
          content="LandLink revolutionizes land service delivery in Kenya. Book licensed surveyors, verify your property boundaries, and manage payments securely with Paystack & M-Pesa."
        />
        <meta
          name="keywords"
          content="land verification, land survey Kenya, survey booking, Paystack, M-Pesa payments, property boundaries, land services Kenya"
        />
        <meta name="author" content="LandLink" />
        <meta
          property="og:title"
          content="LandLink - Trusted Land Verification & Survey Booking in Kenya"
        />
        <meta
          property="og:description"
          content="Book licensed surveyors, verify your land, and pay securely via Paystack or M-Pesa with LandLink."
        />
        <meta property="og:url" content="https://www.landlink.co.ke/" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "LandLink",
              "url": "https://www.landlink.co.ke/",
              "logo": "https://www.landlink.co.ke/assets/logo.png",
              "founder": {
                "@type": "Person",
                "name": "Titus Waweru"
              },
              "sameAs": [
                "https://www.linkedin.com/in/yourprofile",
                "https://twitter.com/yourhandle",
                "https://www.facebook.com/yourpage"
              ]
            }
          `}
        </script>
      </Helmet>

      <div className="bg-[#fff6e5] min-h-screen font-manrope px-4 sm:px-8 md:px-20 py-16">
        {/* Back to Landing Page Link */}
        <Link to="/" className="inline-flex items-center text-sm text-yellow-600 hover:underline mb-6">
          ← Back to Landing Page
        </Link>

        {/* Welcome Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            Welcome to <span className="text-yellow-600">LandLink</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Revolutionizing land service delivery in Kenya. From trusted land
            verification to expert survey bookings, LandLink empowers you with
            reliable, transparent, and secure tools.
          </p>
        </div>

        {/* Hero Section */}
        <div
          className="flex flex-col lg:flex-row items-center gap-10 mb-20"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <img
            src="/assets/lands.jpg"
            alt="Land services illustration"
            className="w-full lg:w-1/2 rounded-xl shadow-lg"
          />
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Digitizing Land Services
            </h2>
            <p className="text-gray-700 mb-4">
              No more queues or paperwork. With LandLink, clients book
              surveyors, track progress, and manage land data — all from a
              modern digital dashboard.
            </p>
            <a href="/signup">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-2xl shadow">
                Get Started
              </button>
            </a>
          </div>
        </div>

        {/* Key Features */}
        <section className="mb-20" data-aos="fade-up">
          <h2 className="text-2xl font-bold text-center mb-10">
            What Makes LandLink Stand Out?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Reliable Land Verification",
                desc: "Ensure your property boundaries are accurate and legally compliant.",
                icon: "/assets/lands 2.jpg",
              },
              {
                title: "Streamlined Booking System",
                desc: "Schedule surveyor appointments effortlessly through our dashboard.",
                icon: "/assets/lands 6.jpg",
              },
              {
                title: "Secure & Instant Payments",
                desc: "Use Paystack or M-Pesa to pay securely and quickly for services.",
                icon: "/assets/lands 3.jpg",
              },
              {
                title: "Professional Surveyors",
                desc: "Get matched with licensed, verified land surveyors near you.",
                icon: "/assets/lands 4.jpg",
              },
              {
                title: "Client Dashboard",
                desc: "Track jobs, download documents, and manage your profile with ease.",
                icon: "/assets/lands 5.jpg",
              },
              {
                title: "SMS & Email Alerts",
                desc: "Stay notified with real-time updates for every service stage.",
                icon: "/assets/lands 7.jpg",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <img
                  src={feature.icon}
                  alt="icon"
                  className="w-[150px] h-[150px] mx-auto mb-4 rounded-xl object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-4">
            Join thousands redefining land services
          </h2>
          <p className="mb-6 text-gray-700">
            Create your LandLink account and enjoy seamless, professional land
            solutions today.
          </p>
          <a href="/signup">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg">
              Sign Up Now
            </button>
          </a>
        </section>
      </div>
    </>
  );
}
