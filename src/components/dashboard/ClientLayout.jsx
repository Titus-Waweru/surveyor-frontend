import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function ClientLayout({ user, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const seen = sessionStorage.getItem("clientSidebarSeen");
    return !seen;
  });

  useEffect(() => {
    let timeout;
    const seen = sessionStorage.getItem("clientSidebarSeen");

    if (isSidebarOpen && !seen) {
      timeout = setTimeout(() => {
        setIsSidebarOpen(false);
        sessionStorage.setItem("clientSidebarSeen", "true");
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-100 font-[Manrope] relative">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 overflow-hidden transform bg-blue-100 transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <Sidebar role="client" />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Toggle button */}
      <button
        aria-label="Toggle sidebar"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className="lg:hidden absolute top-4 left-4 z-50 bg-white p-2 rounded-full shadow hover:bg-blue-100 transition"
      >
        <Menu className="w-5 h-5 text-blue-600" />
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-64">
        <Navbar user={user} onLogout={onLogout} />

        <main className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 py-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
