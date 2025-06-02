import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Sun, Moon } from "lucide-react";

export default function AdminNavbar({ onLogout }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    navigate("/admin/login");
  };

  return (
    <header className="bg-gradient-to-r from-indigo-800 to-indigo-600/90 dark:from-gray-900 dark:to-gray-800 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-lg font-poppins border-b border-indigo-400 dark:border-gray-700 transition-colors duration-300">
      <h1 className="text-white text-2xl md:text-3xl font-extrabold tracking-wide flex items-center gap-2">
        <span className="bg-white text-indigo-700 dark:text-gray-900 px-2 py-1 rounded-full text-sm font-semibold shadow-sm">
          ADMIN
        </span>
        Dashboard
      </h1>

      <div className="flex items-center gap-4 font-manrope">
        <button
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 dark:hover:bg-gray-700 text-white transition-all duration-200 ring-1 ring-white/10 dark:ring-gray-600 hover:scale-110"
        >
          {darkMode ? <Sun size={18} className="transition-transform" /> : <Moon size={18} className="transition-transform" />}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
