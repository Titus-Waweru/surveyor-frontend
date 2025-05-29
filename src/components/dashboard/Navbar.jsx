// src/components/dashboard/Navbar.jsx
import { useState } from "react";
import { LogOut } from "lucide-react";

export default function Navbar({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-indigo-700 px-6 py-4 flex justify-between items-center shadow-md font-poppins">
      <h2 className="text-2xl font-bold text-white tracking-tight">Dashboard</h2>

      <div className="relative flex items-center gap-4 font-manrope">
        {/* Greeting text - hidden on extra small screens */}
        <div className="text-sm text-white hidden sm:block">
          <span className="font-medium">Hi,</span> {user.email}
        </div>

        {/* Profile avatar with dropdown */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="focus:outline-none"
        >
          <img
            src={user.profileImage || "/default-avatar.png"}
            alt="profile"
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
          />
        </button>

        {/* Dropdown */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-12 w-40 bg-white rounded-lg shadow-lg border z-50 text-sm font-manrope">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
