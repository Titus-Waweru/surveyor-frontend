import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function GISNavbar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    navigate("/gis-expert/login");
  };

  return (
    <header className="bg-[#1e40af] border-b border-yellow-400 px-8 py-6 my-4 flex justify-between items-center shadow-md font-poppins transition-colors duration-300 rounded-b-xl">
      {/* Logo + Title */}
      <h1 className="text-white text-2xl md:text-3xl font-extrabold tracking-wide flex items-center gap-3 ml-4">
        <span className="bg-yellow-400 text-[#1e40af] px-3 py-1 rounded-full text-xs font-bold shadow-md uppercase tracking-wider">
          GIS Expert
        </span>
        Dashboard
      </h1>

      {/* Logout Button */}
      <div className="font-manrope">
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
