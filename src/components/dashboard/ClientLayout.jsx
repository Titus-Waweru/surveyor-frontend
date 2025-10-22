import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 font-inter relative">
      {/* Enhanced Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:shadow-xl
          ${
            isSidebarOpen 
              ? "translate-x-0 shadow-2xl" 
              : "-translate-x-full"
          }`}
      >
        <Sidebar role="client" />
      </div>

      {/* Enhanced Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Enhanced Toggle button */}
      <button
        aria-label="Toggle sidebar"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className={`lg:hidden fixed z-50 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          isSidebarOpen 
            ? "top-6 left-64 -translate-x-3" 
            : "top-6 left-6"
        }`}
      >
        <div className="p-3">
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-slate-700" />
          ) : (
            <Menu className="w-5 h-5 text-slate-700" />
          )}
        </div>
      </button>

      {/* Enhanced Main content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isSidebarOpen 
            ? "lg:ml-0 blur-sm lg:blur-0 pointer-events-none lg:pointer-events-auto" 
            : "ml-0"
        }`}
      >
        <Navbar user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 bg-transparent">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}