import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function SurveyorLayout({ user, onLogout }) {
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: "/surveyor/dashboard" },
    { name: "Payments", path: "/surveyor/payments" },
    { name: "Profile", path: "/surveyor/profile" },
    { name: "Settings", path: "/surveyor/settings" },
  ];

  return (
    <div className="flex h-screen bg-[#f6f9fc]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#e3f2fd] text-[#0a1b3d] shadow-md flex flex-col">
        <div className="p-6 text-2xl font-extrabold tracking-wide border-b border-[#cfd8dc] font-poppins">
          Surveyor<span className="text-yellow-500">.app</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 font-manrope">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === link.path
                  ? "bg-yellow-400 text-[#0a1b3d] font-semibold shadow"
                  : "hover:bg-yellow-100 hover:text-[#0a1b3d] text-[#0a1b3d]"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <button
            onClick={onLogout}
            className="mt-6 px-4 py-2 text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </nav>

        <div className="p-4 text-xs text-gray-600 border-t border-[#cfd8dc] font-manrope">
          &copy; 2025 Surveyor App
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6 bg-[#f6f9fc] font-manrope">
          <div className="bg-white rounded-xl shadow px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
