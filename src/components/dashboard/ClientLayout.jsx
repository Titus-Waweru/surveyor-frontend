// src/components/dashboard/ClientLayout.jsx
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function ClientLayout({ user, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 font-[Manrope]">
      {/* Sidebar - hidden on small screens unless toggled */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform bg-blue-100 transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 lg:flex ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <Sidebar role="client" />
      </div>

      {/* Overlay for sidebar when open on small screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden px-4 py-3 bg-white shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <Navbar user={user} onLogout={onLogout} />
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
