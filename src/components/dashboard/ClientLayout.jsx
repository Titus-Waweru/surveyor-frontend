import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function ClientLayout({ user, onLogout }) {
  /** ───────────────── Auto‑open (one time) logic ───────────────── */
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const seen = sessionStorage.getItem("clientSidebarSeen");
    return !seen;                      // open only if not seen before
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

  /** ───────────────── Layout ───────────────── */
  return (
    <div className="flex h-screen overflow-hidden font-[Manrope] bg-gray-100">
      {/* ────────── Sidebar ────────── */}
      <div
        className={`fixed top-0 left-0 z-60 h-full w-64 transform bg-blue-100 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar role="client" />
      </div>

      {/* ────────── Overlay (mobile) ────────── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ────────── Main column (Navbar + Content) ────────── */}
      <div className="flex flex-col flex-1 h-full">
        {/* Navbar (fixed) */}
        <div className="fixed top-0 left-0 w-full z-50 lg:pl-64">
          <Navbar user={user} onLogout={onLogout} />

          {/* Toggle button (only mobile) */}
          <button
            aria-label="Toggle sidebar"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="lg:hidden absolute top-4 left-4 bg-white p-2 rounded-full shadow hover:bg-blue-100 transition"
          >
            <Menu className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pt-16 px-2 sm:px-4 md:px-6 bg-gray-50 lg:pl-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
