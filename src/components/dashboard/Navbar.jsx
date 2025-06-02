import { LogOut } from "lucide-react";

export default function Navbar({ onLogout }) {
  return (
    <header className="bg-[#1e40af] border-b border-yellow-400 px-8 py-4 flex justify-between items-center shadow-md font-poppins">
      <h2 className="text-2xl font-extrabold text-white tracking-wide">
        Dashboard
      </h2>

      <div className="font-manrope">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
