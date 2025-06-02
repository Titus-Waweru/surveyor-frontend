// src/components/dashboard/Layout.jsx
import Navbar from "./Navbar";

export default function Layout({ user, onLogout, children }) {
  return (
    <div className="flex h-screen bg-[#fff6e5] relative flex-col font-manrope">
      {/* Top Navbar */}
      <Navbar user={user} onLogout={onLogout} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
