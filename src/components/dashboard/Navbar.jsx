import { useState, useEffect } from "react";
import { LogOut, Sun, Moon } from "lucide-react";

export default function Navbar({ onLogout }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <header className="bg-[#1e40af] border-b border-yellow-400 px-4 sm:px-6 md:px-8 py-3 flex justify-between items-center shadow-md font-poppins gap-3">
      
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <h2 className="flex items-center text-xl sm:text-2xl font-extrabold text-white tracking-wide">
          {/*Badge - hidden on small screens */}
          <span className="hidden sm:inline-block bg-yellow-400 text-[#1e40af] px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
            Your
          </span>
          {/* Dashboard text with spacing */}
          <span className="ml-10">Dashboard</span>
        </h2>
      </div>

      {/* Right Section: Theme toggle + Logout */}
      <div className="font-manrope flex items-center gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle light/dark theme"
          className="flex items-center gap-1 sm:gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#1e40af] text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-1 sm:gap-2 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
