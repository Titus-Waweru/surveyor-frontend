// src/components/dashboard/Navbar.jsx

export default function Navbar({ user, onLogout }) {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold font-poppins text-yellow-600">Admin Dashboard</h1>
      <div className="flex items-center gap-4 font-manrope">
        {user?.email && (
          <span className="text-sm text-gray-700">{user.email}</span>
        )}
        <button
          onClick={onLogout}
          className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
