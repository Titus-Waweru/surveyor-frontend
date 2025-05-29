// src/pages/ClientOverview.jsx
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function ClientOverview({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    async function fetchBookings() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/bookings?userEmail=${encodeURIComponent(
            user.email
          )}`,
          {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`HTTP ${response.status} - ${errText}`);
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    }

    if (user?.email) fetchBookings();
  }, [user.email]);

  const total = bookings.length;
  const pending = bookings.filter(
    (b) => b.status?.toLowerCase() === "pending"
  ).length;
  const completed = bookings.filter(
    (b) => b.status?.toLowerCase() === "completed"
  ).length;
  const inProgress = bookings.filter(
    (b) => b.status?.toLowerCase() === "in progress"
  ).length;

  const chartData = [
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress },
    { name: "Completed", value: completed },
  ];

  const COLORS = ["#facc15", "#a78bfa", "#4ade80"];

  if (loading)
    return (
      <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center font-manrope">
        Loading client overview...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#fff6e5] flex items-center justify-center text-red-600 font-manrope">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fff6e5] flex flex-col items-center justify-center px-4 py-10 space-y-10">
      <div
        className="w-full max-w-4xl bg-white shadow-xl rounded-3xl p-10 md:p-14"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold text-yellow-600 text-center mb-6 font-poppins">
          Client Overview
        </h1>

        {total === 0 ? (
          <p className="text-center text-gray-600 font-manrope">
            No bookings found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-manrope">
            <StatCard label="Total Bookings" value={total} color="blue" />
            <StatCard label="Pending" value={pending} color="yellow" />
            <StatCard label="In Progress" value={inProgress} color="purple" />
            <StatCard label="Completed" value={completed} color="green" />
          </div>
        )}
      </div>

      {total > 0 && (
        <div
          className="w-full max-w-6xl grid md:grid-cols-2 gap-8 p-4"
          data-aos="fade-up"
        >
          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center text-gray-700 font-manrope">
              Booking Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center text-gray-700 font-manrope">
              Booking Status Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <div className={`p-6 rounded-xl shadow text-center ${colorMap[color]}`}>
      <h3 className="text-sm font-medium mb-1">{label}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
