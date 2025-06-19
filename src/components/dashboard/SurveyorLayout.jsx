import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Navbar from "./Navbar";

export default function SurveyorLayout({ user, onLogout }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const seen = sessionStorage.getItem("surveyorSidebarSeen");
    return !seen;
  });

  useEffect(() => {
    let timeout;
    const seen = sessionStorage.getItem("surveyorSidebarSeen");

    if (isSidebarOpen && !seen) {
      timeout = setTimeout(() => {
        setIsSidebarOpen(false);
        sessionStorage.setItem("surveyorSidebarSeen", "true");
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [isSidebarOpen]);

  const navLinks = [
    { name: "Dashboard", path: "/surveyor/dashboard" },
    { name: "Payments", path: "/surveyor/payments" },
    { name: "Profile", path: "/surveyor/profile" },
    { name: "Settings", path: "/surveyor/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-[Manrope] relative">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-blue-100 transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6 text-2xl font-extrabold tracking-wide border-b border-blue-200 font-poppins">
          Surveyor<span className="text-yellow-500">.app</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3 font-manrope">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-5 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
                location.pathname === link.path
                  ? "bg-yellow-400 text-[#0a1b3d] shadow font-bold"
                  : "hover:bg-yellow-100 hover:text-[#0a1b3d] text-[#0a1b3d]"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 text-xs text-gray-600 border-t border-blue-200 font-manrope">
          &copy; 2025 LandLink App
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Toggle Button */}
      <button
        aria-label="Toggle sidebar"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className="lg:hidden absolute top-4 left-4 z-50 bg-white p-2 rounded-full shadow hover:bg-yellow-100 transition"
      >
        <Menu className="w-5 h-5 text-yellow-600" />
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto bg-gray-50 px-4 sm:px-6 md:px-8 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
