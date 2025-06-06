import React, { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

export default function GISLayout({ user, onLogout }) {
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
      {/* Top Navbar */}
      <div className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-yellow-600">GIS Expert Dashboard</h1>
        <button
          onClick={onLogout}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out bg-white shadow-md w-64 lg:relative lg:translate-x-0 lg:flex ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="h-full p-6 bg-white">
            <h2 className="text-yellow-600 text-xl font-bold mb-8">GIS Expert Menu</h2>
            <ul className="space-y-4">
              <li>
                <NavLink
                  to="overview"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-yellow-600" : "text-gray-700 hover:text-yellow-500"
                  }
                >
                  Overview
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="profile"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-yellow-600" : "text-gray-700 hover:text-yellow-500"
                  }
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="settings"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-yellow-600" : "text-gray-700 hover:text-yellow-500"
                  }
                >
                  Settings
                </NavLink>
              </li>
            </ul>
          </nav>
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
