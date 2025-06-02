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
    <header className="bg-[#1e40af] px-6 py-4 flex justify-between items-center shadow-lg font-poppins border-b border-yellow-400 transition-colors duration-300">
      <h1 className="text-white text-2xl md:text-3xl font-extrabold tracking-wide flex items-center gap-2">
        <span className="bg-yellow-400 text-[#1e40af] px-2 py-1 rounded-full text-sm font-semibold shadow-sm">
          ADMIN
        </span>
        Dashboard
      </h1>

      <div className="flex items-center gap-4 font-manrope">
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
