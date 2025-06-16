import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function AdminNavbar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    navigate("/admin/login");
  };

  return (
    <header className="bg-[#1e40af] border-b border-yellow-400 px-4 sm:px-6 md:px-8 py-3 flex justify-between items-center shadow-md font-poppins gap-3">
      
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <h2 className="flex items-center text-xl sm:text-2xl font-extrabold text-white tracking-wide">
          {/* ADMIN Badge - hidden on small screens */}
          <span className="hidden sm:inline-block bg-yellow-400 text-[#1e40af] px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
            ADMIN
          </span>
          {/* Dashboard text with spacing */}
          <span className="ml-10">Dashboard</span>
        </h2>
      </div>

      {/* Right Section: Logout */}
      <div className="font-manrope">
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 sm:gap-2 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
