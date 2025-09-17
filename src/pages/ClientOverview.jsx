import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const COLORS = ["#facc15", "#f59e0b", "#fcd34d", "#fde68a"];

export default function ClientOverview({ user }) {
  const [summary, setSummary] = useState({
    totalParcels: 0,
    activeBookings: 0,
    completedBookings: 0,
    pendingPayments: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    if (user?.email) fetchOverview();
  }, [user?.email]);

  const fetchOverview = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/client/overview`, {
        params: { email: user.email },
      });
      setSummary(res.data.summary);
      setChartData(res.data.chartData);
    } catch (err) {
      console.error("Failed to fetch overview:", err);
      alert("❌ Failed to load overview.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff6e5] flex justify-center items-start py-10 font-manrope">
      <div
        className="w-full max-w-6xl bg-white rounded-3xl shadow-xl p-6 sm:p-10 md:p-14 mx-2 sm:mx-4"
        data-aos="fade-up"
      >
        <h1 className="text-3xl font-bold text-yellow-600 mb-10 text-center font-poppins">
          Client Dashboard Overview
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-yellow-50 p-6 rounded-2xl shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-800">Parcels</h2>
            <p className="text-3xl font-bold text-yellow-600">
              {summary.totalParcels}
            </p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-2xl shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-800">Active</h2>
            <p className="text-3xl font-bold text-yellow-600">
              {summary.activeBookings}
            </p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-2xl shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-800">Completed</h2>
            <p className="text-3xl font-bold text-yellow-600">
              {summary.completedBookings}
            </p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-2xl shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-800">Pending</h2>
            <p className="text-3xl font-bold text-yellow-600">
              {summary.pendingPayments}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Pie Chart */}
          <div className="bg-white px-4 sm:px-6 py-6 rounded-2xl shadow-lg w-full min-h-[360px] flex items-center justify-center">
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
          <div className="bg-white px-4 sm:px-6 py-6 rounded-2xl shadow-lg w-full min-h-[360px] flex items-center justify-center">
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
      </div>
    </div>
  );
}
