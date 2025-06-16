import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import AdminNavbar from "./Navbar"; // ✅ Admin top navbar

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex h-screen bg-blue-50 relative flex-col">
      {/* ✅ Top Navbar */}
      <AdminNavbar onLogout={() => localStorage.clear()} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out bg-white shadow-md w-64 lg:relative lg:translate-x-0 lg:flex ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
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
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="lg:hidden absolute top-4 left-4 z-50 bg-white p-2 rounded-full shadow hover:bg-yellow-100 transition"
        >
          <Menu className="w-5 h-5 text-yellow-600" />
        </button>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
