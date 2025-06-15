import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

const NAVBAR_HEIGHT = 64; // Centralized navbar height (px)

export default function ClientLayout({ user, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    let timeout;
    const hasAutoClosed = sessionStorage.getItem("sidebarAutoClosed");

    if (isSidebarOpen && !hasAutoClosed) {
      timeout = setTimeout(() => {
        setIsSidebarOpen(false);
        sessionStorage.setItem("sidebarAutoClosed", "true");
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-100 font-[Manrope]">
      {/* Navbar */}
      <div className="relative z-50 h-16">
        <Navbar user={user} onLogout={onLogout} />

        {/* Mobile toggle button */}
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="lg:hidden absolute top-4 left-4 z-50 bg-white p-2 rounded-full shadow hover:bg-blue-100 transition"
        >
          <Menu className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed top-[${NAVBAR_HEIGHT}px] left-0 z-40 transform bg-blue-100 transition-transform duration-300 ease-in-out w-64 lg:relative lg:translate-x-0 lg:flex overflow-hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
        >
          <Sidebar role="client" />
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-h-screen p-2 sm:p-4 md:p-6 bg-gray-50">
          <div className="bg-white shadow-md rounded-2xl px-4 sm:px-6 md:px-10 py-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
