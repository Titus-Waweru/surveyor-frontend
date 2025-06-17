import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";

export default function AboutUs() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#fff6e5] min-h-screen font-poppins text-gray-800">
      <div className="px-4 sm:px-8 md:px-20 py-16">
        {/* Back to Landing Page */}
        <Link
          to="/"
          className="inline-flex items-center text-sm text-yellow-600 hover:underline mb-6"
        >
          ← Back
        </Link>

        <h1
          className="text-4xl md:text-5xl font-bold mb-10 text-center"
          data-aos="fade-down"
        >
          About LandLink
        </h1>

        {/* Introduction */}
        <section className="mb-16" data-aos="fade-up">
          <p className="text-lg leading-relaxed">
            <strong>LandLink</strong> is a next-generation platform built to
            revolutionize land service delivery across Kenya and beyond. From
            streamlining surveys to enabling transparent job tracking, LandLink
            empowers clients, surveyors, and administrators with intelligent,
            fast, and secure tools.
          </p>
        </section>

        {/* Vision / Mission / Values */}
        <section className="grid md:grid-cols-3 gap-10 mb-16" data-aos="fade-up">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
            <p>
              To be the digital backbone for land services in Africa, enabling
              smart and transparent land management for all.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
            <p>
              To simplify land service access through technology, ensuring every
              client can book, track, and pay seamlessly from anywhere.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">Our Values</h2>
            <p>
              Integrity, Innovation, Transparency, and Accessibility. We’re
              committed to transforming how land services are delivered — one
              booking at a time.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-16" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-lg leading-relaxed">
            Born out of the need for modern, efficient, and client-friendly land
            services, LandLink was founded by a team of engineers and land
            experts who believe technology can eliminate the long queues, lost
            paperwork, and endless follow-ups traditionally involved in land
            surveying and inspection.
          </p>
        </section>

        {/* Team / Founders */}
        <section className="mb-16" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-8 text-center">Meet the Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                name: "Titus Waweru",
                title: "Founder & CEO",
                image: "/assets/titus.jpg",
                link: "/about/titus-waweru",
              },
              {
                name: "Sarah Mwangi",
                title: "Operations Lead",
                image: "/assets/sarah.jpg",
                link: "/about/sarah-mwangi",
              },
              {
                name: "Michael Otieno",
                title: "Lead Engineer",
                image: "/assets/michael.JPG",
                link: "/about/michael-otieno",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow p-6 text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-[150px] h-[150px] mx-auto mb-3 rounded-full object-cover"
                />
                <h3 className="font-bold text-xl">{member.name}</h3>
                <p className="text-gray-600">{member.title}</p>
                <Link
                  to={member.link}
                  className="text-sm text-yellow-500 hover:underline mt-2 inline-block"
                >
                  Read more →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-20" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-4">Join the LandLink Journey</h2>
          <p className="mb-6">
            We're on a mission to redefine land services in Africa. Be part of
            this transformation.
          </p>
          <a href="/signup">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-2xl shadow">
              Get Started
            </button>
          </a>
        </section>
      </div>
    </div>
  );
}
