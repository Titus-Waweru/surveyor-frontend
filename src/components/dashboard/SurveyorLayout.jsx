import { Link, Outlet, useLocation } from "react-router-dom";

export default function SurveyorLayout({ user, onLogout }) {
  const location = useLocation();

  const navLinks = [
    { name: "Overview", path: "/surveyor/dashboard" },
    { name: "Profile", path: "/surveyor/profile" },
    { name: "Settings", path: "/surveyor/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-indigo-700 mb-8">Surveyor Panel</h2>
        <nav className="space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-4 py-2 rounded hover:bg-indigo-100 ${
                location.pathname === link.path
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-700"
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
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
