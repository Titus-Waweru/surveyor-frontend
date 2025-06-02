import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react"; // Optional: install lucide-react for icons

export default function AdminNavbar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    navigate("/admin/login");
  };

  return (
    <header className="bg-gradient-to-r from-indigo-800 to-indigo-600/90 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-md font-poppins border-b border-indigo-400">
      <h1 className="text-white text-2xl md:text-3xl font-extrabold tracking-wide flex items-center gap-2">
        <span className="bg-white text-indigo-700 px-2 py-1 rounded-full text-sm font-semibold shadow-sm">ADMIN</span>
        Dashboard
      </h1>

      <div className="flex items-center gap-4 font-manrope">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
