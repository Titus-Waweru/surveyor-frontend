import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Navbar from "./Navbar";

export default function SurveyorLayout({ user, onLogout }) {
  const location = useLocation();

  // Open sidebar initially only if not seen in this session
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const seen = sessionStorage.getItem("surveyorSidebarSeen");
    return !seen;
  });

  // Auto-close after 5s only once per session
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
    <div className="flex h-screen bg-[#f6f9fc] relative font-[Manrope]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out bg-[#e3f2fd] text-[#0a1b3d] shadow-md w-64 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 sm:p-6 text-xl sm:text-2xl font-extrabold tracking-wide border-b border-[#cfd8dc] font-poppins">
          Surveyor<span className="text-yellow-500">.app</span>
        </div>

        <nav className="flex-1 px-2 sm:px-4 py-4 sm:py-6 space-y-2 font-manrope">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === link.path
                  ? "bg-yellow-400 text-[#0a1b3d] font-semibold shadow"
                  : "hover:bg-yellow-100 hover:text-[#0a1b3d] text-[#0a1b3d]"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="p-2 sm:p-4 text-xs text-gray-600 border-t border-[#cfd8dc] font-manrope">
          &copy; 2025 LandLink App
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className="lg:hidden absolute top-4 left-4 z-50 bg-white p-2 rounded-full shadow hover:bg-yellow-100 transition"
      >
        <Menu className="w-5 h-5 text-yellow-600" />
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6 bg-[#f6f9fc]">
          <div className="bg-white rounded-xl shadow px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
