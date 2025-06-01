// src/components/dashboard/Layout.jsx
import Navbar from "./Navbar"; // ensure this is the correct path

export default function Layout({ user, onLogout, children }) {
  return (
    <div className="min-h-screen bg-[#fff6e5] flex flex-col font-manrope">
      <Navbar user={user} onLogout={onLogout} />
      <main className="flex-grow p-6">{children}</main>
    </div>
  );
}
