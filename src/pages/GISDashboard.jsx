import React from "react";

export default function GISDashboard({ user }) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">GIS Expert Dashboard</h1>
      <p>Welcome, {user?.email || "GIS Expert"}</p>
      {/* Add dashboard stats, charts, or info here */}
    </div>
  );
}
