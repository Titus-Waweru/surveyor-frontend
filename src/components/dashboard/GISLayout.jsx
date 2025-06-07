import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import GISNavbar from "./GISNavbar";
import Sidebar from "./Sidebar";

export default function GISLayout({ user, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auto-close sidebar after 5 seconds on mobile
  useEffect(() => {
    let timeout;
    if (isSidebarOpen) {
      timeout = setTimeout(() => {
        setIsSidebarOpen(false);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-[#fff6e5] font-manrope relative">
      {/* Sidebar */}
      <div
        className={`fixed left-0 z-50 transform bg-blue-50 transition-transform duration-300 ease-in-out w-64 lg:relative lg:translate-x-0 lg:flex ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          top: "64px", // Height of GISNavbar
          height: "calc(100vh - 64px)", // fill below navbar
        }}
      >
        <Sidebar role="gis-expert" />
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar + toggle button */}
        <div className="relative">
          <GISNavbar user={user} onLogout={onLogout} />
          {/* Toggle button for sidebar (mobile only) */}
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="lg:hidden absolute top-1/2 -translate-y-1/2 left-4 z-50 bg-white p-2 rounded-full shadow hover:bg-yellow-100 transition"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-yellow-600" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-md px-6 py-8 min-h-[calc(100vh-128px)]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
