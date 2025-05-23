export default function AdminNavbar({ onLogout }) {
  return (
    <header className="bg-indigo-700 px-6 py-4 flex justify-between items-center shadow font-poppins">
      {/* Title */}
      <h1 className="text-2xl font-bold text-white tracking-tight">
        Admin Dashboard
      </h1>

      {/* Logout Section */}
      <div className="flex items-center gap-4 font-manrope">
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
