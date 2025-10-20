import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { TrendingUp, Users, Droplets, Clock } from "lucide-react";

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    dailySales: [],
    monthlyComparison: [],
    yearlySales: [],
    totalSales: 0,
    totalOrders: 0,
    walkInOrders: 0,
    deliveryOrders: 0,
    topBuyers: [],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/admin/dashboard"
        );
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      }
    };
    fetchDashboard();
  }, []);

  const safeTotalSales = stats.totalSales ?? 0;
  const safeTotalOrders = stats.totalOrders ?? 0;
  const avgOrderValue =
    safeTotalOrders > 0 ? (safeTotalSales / safeTotalOrders).toFixed(2) : 0;

  const currentMonthData = stats.monthlyComparison.filter((m) =>
    m.month?.toLowerCase().includes("oct")
  );
  const previousMonthData = stats.monthlyComparison.filter(
    (m) => !m.month?.toLowerCase().includes("oct")
  );

  return (
    <div className="p-8 bg-gradient-to-b from-blue-50 via-sky-100 to-blue-200 min-h-screen">
      {/* Header */}
      <h1 className="text-5xl font-extrabold text-blue-900 mb-12 flex items-center gap-4 animate-fade-in">
        <Droplets className="text-blue-600 animate-pulse" />
        Moises Refill Station <span className="text-sky-600">Analytics</span>
      </h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<TrendingUp className="text-green-500" />}
          label="Total Sales"
          value={`₱${safeTotalSales.toLocaleString()}`}
          gradient="from-green-200 to-green-100"
        />
        <StatCard
          icon={<Droplets className="text-blue-500" />}
          label="Total Orders"
          value={safeTotalOrders}
          gradient="from-blue-200 to-blue-100"
        />
        <StatCard
          icon={<Clock className="text-yellow-500" />}
          label="Avg. Order Value"
          value={`₱${avgOrderValue}`}
          gradient="from-yellow-200 to-yellow-100"
        />
        <StatCard
          icon={<Users className="text-purple-500" />}
          label="Top Buyers"
          value={stats.topBuyers?.length ?? 0}
          gradient="from-purple-200 to-purple-100"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-10">
        <ChartCard title="Daily Sales Trend">
          <Bar
            data={{
              labels: stats.dailySales.map((d) => d.day),
              datasets: [
                {
                  label: "Sales (₱)",
                  data: stats.dailySales.map((d) => d.total ?? 0),
                  backgroundColor: "rgba(37, 99, 235, 0.7)",
                  borderRadius: 10,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: true, mode: "index", intersect: false },
              },
              animation: { duration: 1000, easing: "easeOutQuart" },
            }}
          />
        </ChartCard>

        <ChartCard title="Monthly Sales Comparison (Histogram)">
          <Bar
            data={{
              labels: stats.monthlyComparison.map((m) => m.month),
              datasets: [
                {
                  label: "Current Month",
                  data: currentMonthData.map((m) => m.total),
                  backgroundColor: "rgba(37, 99, 235, 0.7)",
                  borderRadius: 6,
                },
                {
                  label: "Previous Month",
                  data: previousMonthData.map((m) => m.total),
                  backgroundColor: "rgba(156, 163, 175, 0.7)",
                  borderRadius: 6,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "bottom" } },
              scales: { x: { stacked: false }, y: { beginAtZero: true } },
              animation: { duration: 1200, easing: "easeOutCubic" },
            }}
          />
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 mt-12">
        <ChartCard title="Walk-in vs Delivery Orders" center>
          <Doughnut
            data={{
              labels: ["Walk-in", "Delivery"],
              datasets: [
                {
                  data: [stats.walkInOrders ?? 0, stats.deliveryOrders ?? 0],
                  backgroundColor: ["#3b82f6", "#facc15"],
                  hoverOffset: 8,
                },
              ],
            }}
            options={{
              plugins: { legend: { position: "bottom" } },
              animation: { animateRotate: true, duration: 1000 },
            }}
          />
        </ChartCard>

        <ChartCard title="Yearly Sales Report (Histogram)">
          <Bar
            data={{
              labels: stats.yearlySales.map((y) => y.year),
              datasets: [
                {
                  label: "Sales (₱)",
                  data: stats.yearlySales.map((y) => y.total),
                  backgroundColor: "rgba(16, 185, 129, 0.7)",
                  borderRadius: 8,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "bottom" } },
              scales: { y: { beginAtZero: true } },
              animation: { duration: 1200, easing: "easeOutCubic" },
            }}
          />
        </ChartCard>
      </div>

      {/* Top Buyers */}
      <div className="mt-12">
        <ChartCard title="Top 5 Buyers">
          <ul className="divide-y divide-gray-200">
            {stats.topBuyers?.map((buyer, idx) => (
              <li
                key={idx}
                className="py-3 flex justify-between items-center text-gray-700 px-4 rounded-lg transition-all hover:bg-blue-50 hover:scale-105"
              >
                <span className="font-medium">{buyer.name || buyer._id}</span>
                <span className="font-semibold text-blue-800">
                  ₱{(buyer.total ?? buyer.totalSpent ?? 0).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, gradient }) {
  return (
    <div
      className={`flex items-center p-5 rounded-3xl shadow-xl gap-4 transition transform hover:scale-105 bg-gradient-to-br ${gradient} border border-white/30 backdrop-blur-md`}
    >
      <div className="p-3 bg-white/20 rounded-xl">{icon}</div>
      <div>
        <p className="text-gray-700 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children, center }) {
  return (
    <div
      className={`bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl transition transform hover:scale-[1.02] ${
        center ? "flex flex-col items-center" : ""
      }`}
    >
      <h2 className="text-xl font-semibold mb-4 text-blue-800">{title}</h2>
      {children}
    </div>
  );
}
