import { useState } from "react";
import { LogOut } from "lucide-react";

export default function Navbar({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-indigo-700 px-8 py-4 flex justify-between items-center shadow-md font-poppins">
      <h2 className="text-2xl font-extrabold text-white tracking-wide">
        Dashboard
      </h2>

      <div className="relative flex items-center gap-5 font-manrope">
        {/* Greeting */}
        <div className="text-sm text-white hidden sm:block">
          <span className="font-semibold">Hi,</span> {user.email}
        </div>

        {/* Profile button */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="focus:outline-none transition-transform duration-150 hover:scale-105"
        >
          <img
            src={user.profileImage || "/default-avatar.png"}
            alt="profile"
            className="w-9 h-9 rounded-full border-2 border-white object-cover"
          />
        </button>

        {/* Dropdown */}
        {isMenuOpen && (
          <div className="absolute right-0 top-12 w-44 bg-white rounded-lg shadow-lg border text-sm z-50 font-manrope overflow-hidden">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
