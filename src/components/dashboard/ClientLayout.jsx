// src/components/dashboard/ClientLayout.jsx
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function ClientLayout({ user, onLogout }) {
  return (
    <div className="flex h-screen bg-gray-100 font-[Manrope]">
      {/* Sidebar */}
      <div className="w-40 sm:w-52 md:w-64">
        <Sidebar role="client" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
