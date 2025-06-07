import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isClient = location.pathname.startsWith("/client");
  const isSurveyor = location.pathname.startsWith("/surveyor");
  const isGIS = location.pathname.startsWith("/gis");

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
    : isGIS
    ? [
        { name: "Overview", href: "/gis/overview" },
        { name: "Profile", href: "/gis/profile" },
        { name: "Settings", href: "/gis/settings" },
      ]
    : [];

  return (
    <aside className="w-52 min-h-screen bg-[#e3f2fd] text-[#0a1b3d] flex flex-col shadow-md">
      {/* Logo / Brand */}
      <div className="p-5 text-xl font-extrabold tracking-wide border-b border-[#cfd8dc] font-poppins">
        LandLink<span className="text-yellow-500">.app</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-5 space-y-2 font-manrope">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                isActive
                  ? "bg-yellow-300 text-[#0a1b3d] font-semibold ring-1 ring-yellow-500/30"
                  : "hover:bg-yellow-100 hover:text-[#0a1b3d] text-[#0a1b3d] font-medium"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 text-xs text-gray-600 border-t border-[#cfd8dc] font-manrope">
        &copy; 2025 LandLink Ltd
      </div>
    </aside>
  );
};

export default Sidebar;
