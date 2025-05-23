import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

export default function Layout({ user, onLogout, children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-lg shadow px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
