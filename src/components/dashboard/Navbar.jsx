// src/components/dashboard/Navbar.jsx
export default function Navbar({ user, onLogout }) {
  return (
    <header className="bg-indigo-700 px-6 py-4 flex justify-between items-center shadow-md font-poppins">
      <h2 className="text-2xl font-bold text-white tracking-tight">
        Dashboard
      </h2>

      <div className="flex items-center gap-4 font-manrope">
        <div className="text-sm text-white">
          <span className="font-medium">Hi,</span> {user.email}
        </div>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
