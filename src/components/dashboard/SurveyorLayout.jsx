import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";  // import Sidebar
import { Outlet } from "react-router-dom";

export default function SurveyorLayout({ user, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    let timeout;
    if (isSidebarOpen) {
      timeout = setTimeout(() => setIsSidebarOpen(false), 5000);
    }
    return () => clearTimeout(timeout);
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-100 font-[Manrope] relative">
      {/* Sidebar */}
      <div
        className={`fixed left-0 z-50 transform bg-blue-100 transition-transform duration-300 ease-in-out w-64 lg:relative lg:translate-x-0 lg:flex overflow-hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          top: "64px",
          height: "calc(100vh - 64px)",
        }}
      >
        <Sidebar role="surveyor" />
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
