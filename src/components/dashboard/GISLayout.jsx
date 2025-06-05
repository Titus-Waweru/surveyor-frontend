import React from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function GISLayout({ user, onLogout }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-yellow-400 p-6">
        <h2 className="text-white text-xl font-bold mb-8">GIS Expert Menu</h2>
        <ul className="space-y-4">
          <li>
            <NavLink
              to="overview"
              className={({ isActive }) =>
                isActive ? "font-bold text-white" : "text-gray-800"
              }
            >
              Overview
            </NavLink>
          </li>
          <li>
            <NavLink
              to="profile"
              className={({ isActive }) =>
                isActive ? "font-bold text-white" : "text-gray-800"
              }
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="settings"
              className={({ isActive }) =>
                isActive ? "font-bold text-white" : "text-gray-800"
              }
            >
              Settings
            </NavLink>
          </li>
          <li>
            <button
              onClick={onLogout}
              className="mt-10 bg-white text-yellow-500 px-4 py-2 rounded hover:bg-yellow-100"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
