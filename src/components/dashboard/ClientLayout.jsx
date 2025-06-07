import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

export default function ClientLayout({ user, onLogout }) {
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
    <div className="flex h-screen bg-gray-100 font-[Manrope] relative">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform bg-blue-100 transition-transform duration-300 ease-in-out w-64 lg:relative lg:translate-x-0 lg:flex ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar role="client" />
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
        {/* Navbar with integrated toggle */}
        <div className="bg-white shadow px-4 py-3 flex items-center justify-between">
          {/* Toggle visible only on mobile */}
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="lg:hidden mr-4 bg-white p-2 rounded-md shadow hover:bg-blue-100 transition"
          >
            <Menu className="w-5 h-5 text-blue-600" />
          </button>

          <div className="flex-1">
            <Navbar user={user} onLogout={onLogout} />
          </div>
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
