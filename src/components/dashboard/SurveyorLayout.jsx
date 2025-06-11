import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Navbar from "./Navbar";

export default function SurveyorLayout({ user, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Start open
  const location = useLocation();

  // Auto-close sidebar after 5 seconds
  useEffect(() => {
    let timeout;
    if (isSidebarOpen) {
      timeout = setTimeout(() => {
        setIsSidebarOpen(false);
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
        className={`fixed left-0 z-50 transform bg-blue-100 transition-transform duration-300 ease-in-out w-64 lg:relative lg:translate-x-0 lg:flex overflow-hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          top: "64px", // height of navbar
          height: "calc(100vh - 64px)", // full height minus navbar
        }}
      >
        <div className="p-4 text-xl font-extrabold tracking-wide border-b border-blue-200 font-[Poppins]">
          Surveyor<span className="text-yellow-500">.app</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === link.path
                  ? "bg-yellow-400 text-blue-900 font-semibold shadow"
                  : "hover:bg-yellow-100 hover:text-blue-900 text-blue-900"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 text-xs text-gray-600 border-t border-blue-200 font-[Manrope]">
          &copy; 2025 LandLink App
        </div>
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
        {/* Navbar */}
        <div className="relative">
          <Navbar user={user} onLogout={onLogout} />
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="lg:hidden absolute top-1/2 -translate-y-1/2 left-4 z-50 bg-white p-2 rounded-full shadow hover:bg-blue-100 transition"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-md px-6 py-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
