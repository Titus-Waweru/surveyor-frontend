// src/components/dashboard/Sidebar.jsx
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isClient = location.pathname.startsWith("/client");
  const isSurveyor = location.pathname.startsWith("/surveyor");

  const links = isAdmin
    ? [
        { name: "Overview", href: "/admin/overview" },
        { name: "Bookings", href: "/admin/bookings" },
        { name: "Profile", href: "/admin/profile" },
        { name: "Settings", href: "/admin/settings" },
      ]
    : isClient
    ? [
        { name: "Overview", href: "/client/overview" },
        { name: "Bookings", href: "/client/bookings" },
        { name: "Payments", href: "/client/payments" },
        { name: "Profile", href: "/client/profile" },
        { name: "Settings", href: "/client/settings" },
      ]
    : isSurveyor
    ? [
        { name: "Dashboard", href: "/surveyor/dashboard" },
        { name: "Payments", href: "/surveyor/payments" },
        { name: "Profile", href: "/surveyor/profile" },
        { name: "Settings", href: "/surveyor/settings" },
      ]
    : [];

  return (
    <aside className="w-64 bg-[#e3f2fd] text-[#0a1b3d] flex flex-col shadow-md">
      <div className="p-6 text-2xl font-extrabold tracking-wide border-b border-[#cfd8dc] font-poppins">
        Surveyor<span className="text-yellow-500">.app</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 font-manrope">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-yellow-400 text-[#0a1b3d] font-semibold shadow"
                  : "hover:bg-yellow-100 hover:text-[#0a1b3d] text-[#0a1b3d]"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 text-xs text-gray-600 border-t border-[#cfd8dc] font-manrope">
        &copy; 2025 Surveyor App
      </div>
    </aside>
  );
};

export default Sidebar;
