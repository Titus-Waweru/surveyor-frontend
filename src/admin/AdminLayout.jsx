import Sidebar from "../components/dashboard/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar on the left */}
      <div className="w-40 sm:w-52 md:w-64">
        <Sidebar />
      </div>

      {/* Main content area */}
      <main className="flex-1 p-6 bg-blue-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
