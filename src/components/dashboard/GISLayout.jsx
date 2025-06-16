import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

export default function ClientLayout({ user, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <div className="min-h-screen bg-gray-100 font-[Manrope]">
      {/* Navbar */}
      <div className="relative z-50">
        <Navbar user={user} onLogout={onLogout} />

        {/* Toggle button inside navbar */}
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
          className={`fixed top-[64px] left-0 z-40 transform bg-blue-100 transition-transform duration-300 ease-in-out w-64 lg:relative lg:translate-x-0 lg:flex overflow-hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ height: "calc(100vh - 64px)" }}
        >
          <Sidebar role="client" />
        </div>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 min-h-screen p-2 sm:p-4 md:p-6 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
