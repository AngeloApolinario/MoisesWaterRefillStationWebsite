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
  LogOut,
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

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen flex flex-col bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white transition-all duration-300 shadow-2xl z-50 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo / Toggle */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-blue-700">
          {!isCollapsed && (
            <h2 className="text-2xl font-bold tracking-wide">Admin Panel</h2>
          )}
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
        <nav className="flex-1 mt-6 space-y-2 px-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={`/admin/${item.path}`}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md ${
                  isActive
                    ? "bg-white text-blue-900 shadow-lg"
                    : "hover:bg-blue-700 hover:text-white"
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

        {/* Footer / Admin Info & Logout */}
        <div
          className={`px-5 py-4 border-t border-blue-700 flex flex-col gap-3 ${
            isCollapsed ? "items-center" : ""
          }`}
          style={{ marginTop: "auto" }}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white font-bold shadow-inner">
                A
              </div>
              <div>
                <p className="text-sm font-semibold">Admin</p>
                <p className="text-xs text-blue-200">Administrator</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow hover:shadow-lg ${
              isCollapsed
                ? "justify-center w-full bg-red-500 hover:bg-red-600"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
            title="Logout"
          >
            <LogOut size={20} />
            {!isCollapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-8 transition-all`}
        style={{ marginLeft: isCollapsed ? "5rem" : "16rem" }}
      >
        <Routes>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="walkin" element={<AdminWalkIn />} />
          <Route path="website-control" element={<AdminWebsiteControl />} />
        </Routes>
      </main>
    </div>
  );
}
