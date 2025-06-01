import { useNavigate } from "react-router-dom";

export default function AdminNavbar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage or any tokens
    localStorage.removeItem("user"); // or whatever key you used
    localStorage.removeItem("token");

    // Optional: Call a parent logout function
    if (onLogout) onLogout();

    // Redirect to login page
    navigate("/admin/login");
  };

  return (
    <header className="bg-indigo-700 px-6 py-4 flex justify-between items-center shadow font-poppins">
      <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>

      <div className="flex items-center gap-4 font-manrope">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
