import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const bubbles = [
    { size: 40, x: "10%", delay: 0 },
    { size: 25, x: "70%", delay: 0.5 },
    { size: 35, x: "30%", delay: 1 },
    { size: 20, x: "80%", delay: 1.5 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-blue-200 text-blue-800";
      case "On the Way":
        return "bg-sky-400 text-white";
      case "Delivered":
        return "bg-teal-400 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-sky-100 to-blue-200 overflow-hidden py-10">
      {/* Floating bubbles */}
      {bubbles.map((b, idx) => (
        <motion.div
          key={idx}
          className="absolute bg-white/30 rounded-full shadow-lg"
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

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-extrabold text-blue-900 text-center mb-10 drop-shadow-lg"
      >
        My Orders
      </motion.h2>

      <div className="max-w-5xl mx-auto space-y-6">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="relative p-6 bg-gradient-to-r from-blue-100 via-sky-200 to-blue-300 rounded-3xl shadow-2xl border border-blue-200"
          >
            {/* Status badge */}
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}
