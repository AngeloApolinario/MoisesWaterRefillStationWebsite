import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const [sortOrder, setSortOrder] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("All");

  // 🕐 Live timer update
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🧭 Fetch Orders
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/orders?userId=${user._id}`
        );
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancel = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    try {
      await axios.put(`http://localhost:8000/api/admin/orders/${orderId}`, {
        status: "Cancelled",
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "Cancelled" } : o))
      );
      alert("Order cancelled successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order.");
    }
  };

  // ✅ Helpers
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-blue-200 text-blue-800";
      case "On the Way":
        return "bg-sky-400 text-white";
      case "Delivered":
        return "bg-teal-400 text-white";
      case "Cancelled":
        return "bg-red-300 text-red-900";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  const canCancel = (order) => {
    const created = new Date(order.createdAt);
    const diffHours = (now - created) / (1000 * 60 * 60);
    return diffHours < 1 && order.status === "Pending";
  };

  const getTimeRemaining = (order) => {
    const created = new Date(order.createdAt);
    const expires = new Date(created.getTime() + 60 * 60 * 1000);
    const diffMs = expires - now;
    if (diffMs <= 0) return "Expired";
    const minutes = Math.floor(diffMs / 1000 / 60);
    const seconds = Math.floor((diffMs / 1000) % 60);
    return `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`;
  };

  // 🧮 Filter & Sort Logic
  const filteredOrders = orders
    .filter((order) => {
      if (statusFilter === "All") return true;
      return order.status === statusFilter;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  // 🎨 Background bubbles animation
  const bubbles = [
    { size: 40, x: "10%", delay: 0 },
    { size: 25, x: "70%", delay: 0.5 },
    { size: 35, x: "30%", delay: 1 },
    { size: 20, x: "80%", delay: 1.5 },
  ];

  if (!user)
    return (
      <p className="text-center mt-20 text-lg font-semibold text-blue-700">
        Please log in to see your orders.
      </p>
    );
  if (loading)
    return (
      <p className="text-center mt-20 text-lg font-semibold text-blue-700">
        Loading your orders...
      </p>
    );
  if (orders.length === 0)
    return (
      <p className="text-center mt-20 text-lg font-semibold text-blue-700">
        You have no orders yet.
      </p>
    );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-sky-100 to-blue-200 overflow-hidden py-10">
      {/* Floating bubbles */}
      {bubbles.map((b, idx) => (
        <motion.div
          key={idx}
          className="absolute bg-white/30 rounded-full shadow-lg z-0"
          style={{ width: b.size, height: b.size, left: b.x, bottom: 0 }}
          animate={{
            y: ["0%", "-500%"],
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8 + Math.random() * 2,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Page title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-extrabold text-blue-900 text-center mb-8 drop-shadow-lg z-10 relative"
      >
        My Orders
      </motion.h2>

      {/* 🧭 Filters */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between bg-white/60 p-4 rounded-2xl shadow-md mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <label className="font-semibold text-blue-900">
            Filter by Status:
          </label>
          <select
            className="px-3 py-2 rounded-lg border border-blue-300 bg-white text-blue-800"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="On the Way">On the Way</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <label className="font-semibold text-blue-900">Sort by Date:</label>
          <select
            className="px-3 py-2 rounded-lg border border-blue-300 bg-white text-blue-800"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* 🧾 Order Cards */}
      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        {filteredOrders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="relative p-6 bg-gradient-to-r from-blue-100 via-sky-200 to-blue-300 rounded-3xl shadow-2xl border border-blue-200"
          >
            <span
              className={`absolute top-4 right-4 px-3 py-1 rounded-full font-semibold text-sm ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>

            <p>
              <strong>Name:</strong> {order.customerName}
            </p>
            <p>
              <strong>Phone:</strong> {order.phone}
            </p>
            <p>
              <strong>Has Container:</strong>{" "}
              {order.hasContainer ? "Yes" : "No"}
            </p>
            <p>
              <strong>Delivery:</strong> {order.delivery ? "Yes" : "Pickup"}
            </p>
            {order.delivery && (
              <p>
                <strong>Address:</strong> {order.address}
              </p>
            )}
            <p className="text-sm text-blue-700 mt-2">
              Ordered at: {new Date(order.createdAt).toLocaleString()}
            </p>

            {order.status === "Pending" && (
              <p className="mt-2 text-sm font-medium text-blue-800">
                ⏰ Cancel within:{" "}
                <span className="font-bold">{getTimeRemaining(order)}</span>
              </p>
            )}

            {canCancel(order) && (
              <button
                onClick={() => handleCancel(order._id)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Cancel Order
              </button>
            )}

            {!canCancel(order) && order.status === "Pending" && (
              <button
                disabled
                className="mt-4 px-4 py-2 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed"
              >
                Cancel Unavailable (1hr passed)
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Wave at bottom */}
      <svg
        className="absolute bottom-0 w-full h-40 z-0"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <motion.path
          fill="#ffffff"
          fillOpacity="0.6"
          d="M0,160 C360,240 1080,80 1440,160 L1440,320 L0,320 Z"
          animate={{
            d: [
              "M0,160 C360,240 1080,80 1440,160 L1440,320 L0,320 Z",
              "M0,180 C360,120 1080,240 1440,180 L1440,320 L0,320 Z",
              "M0,160 C360,240 1080,80 1440,160 L1440,320 L0,320 Z",
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
        <motion.path
          fill="#ffffff"
          fillOpacity="0.4"
          d="M0,200 C360,280 1080,120 1440,200 L1440,320 L0,320 Z"
          animate={{
            d: [
              "M0,200 C360,280 1080,120 1440,200 L1440,320 L0,320 Z",
              "M0,220 C360,160 1080,240 1440,220 L1440,320 L0,320 Z",
              "M0,200 C360,280 1080,120 1440,200 L1440,320 L0,320 Z",
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}
