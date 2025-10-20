import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  Users,
  SlidersHorizontal,
  Droplets,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AdminDashboard from "./Dashboard";
import AdminOrders from "./Orders";
import AdminUsers from "./Users";
import AdminWalkIn from "./WalkIn";
import AdminWebsiteControl from "./AdminWebsiteControl";

export default function AdminApp() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "dashboard", icon: <Home size={20} /> },
    { name: "Orders", path: "orders", icon: <ShoppingCart size={20} /> },
    { name: "Users", path: "users", icon: <Users size={20} /> },
    { name: "Walk-in Orders", path: "walkin", icon: <Droplets size={20} /> },
    {
      name: "Website Control",
      path: "website-control",
      icon: <SlidersHorizontal size={20} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        } shadow-2xl`}
      >
        {/* Logo / Toggle */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-blue-700">
          {!isCollapsed && <h2 className="text-2xl font-bold">Admin Panel</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md hover:bg-blue-700 transition"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 space-y-2 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={`/admin/${item.path}`}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-white text-blue-900 shadow-lg"
                    : "hover:bg-blue-700"
                }`}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Admin Info */}
        {!isCollapsed && (
          <div className="px-5 py-4 mt-auto border-t border-blue-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-blue-200">Administrator</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gradient-to-b from-blue-50 via-sky-100 to-blue-200 transition-all">
        <Routes>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="walkin" element={<AdminWalkIn />} />
          <Route
            path="website-control"
            element={<AdminWebsiteControl />}
          />{" "}
        </Routes>
      </main>
    </div>
  );
}
