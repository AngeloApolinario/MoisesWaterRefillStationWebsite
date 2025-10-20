import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Truck, Clock, Trash2 } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:8000/api/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/api/admin/orders/${id}`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors = {
    Pending: "bg-yellow-200 text-yellow-800",
    "On The Way": "bg-blue-200 text-blue-800",
    Delivered: "bg-green-200 text-green-800",
    Cancelled: "bg-red-200 text-red-800",
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-lg font-semibold text-blue-700 animate-pulse">
        Loading orders...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-20 text-lg font-semibold text-red-500">
        {error}
      </p>
    );

  const todayOrders = orders.filter((order) => {
    if (!order.createdAt) return false;
    const createdDate = new Date(order.createdAt);
    const today = new Date();
    return (
      createdDate.getDate() === today.getDate() &&
      createdDate.getMonth() === today.getMonth() &&
      createdDate.getFullYear() === today.getFullYear() &&
      order.status.toLowerCase() !== "delivered"
    );
  });

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === filter.toLowerCase());

  const ActionButtons = ({ order }) => (
    <div className="flex flex-wrap gap-2">
      {[
        {
          status: "Pending",
          color: "bg-yellow-500",
          icon: <Clock size={14} />,
        },
        {
          status: "On The Way",
          color: "bg-blue-500",
          icon: <Truck size={14} />,
        },
        {
          status: "Delivered",
          color: "bg-green-500",
          icon: <CheckCircle size={14} />,
        },
        {
          status: "Cancelled",
          color: "bg-red-500",
          icon: <XCircle size={14} />,
        },
      ].map((btn) => (
        <button
          key={btn.status}
          onClick={() => handleStatusUpdate(order._id, btn.status)}
          className={`${btn.color} text-white text-xs font-semibold px-3 py-1 rounded-xl hover:scale-105 transition flex items-center gap-1`}
        >
          {btn.icon} {btn.status}
        </button>
      ))}
      <button
        onClick={() => handleDelete(order._id)}
        className="bg-gray-500 text-white text-xs font-semibold px-3 py-1 rounded-xl hover:scale-105 transition flex items-center gap-1"
      >
        <Trash2 size={14} /> Delete
      </button>
    </div>
  );

  return (
    <div className="p-6 space-y-12">
      {/* Today's Orders */}
      <Section
        title="Today's Orders"
        icon={<Clock className="text-blue-600" />}
      >
        {todayOrders.length === 0 ? (
          <p className="text-center text-blue-700 font-semibold">
            No orders for today or all are delivered.
          </p>
        ) : (
          <GlassTable
            data={todayOrders}
            ActionButtons={ActionButtons}
            statusColors={statusColors}
          />
        )}
      </Section>

      {/* Manage Orders */}
      <Section title="Manage Orders" icon={<Truck className="text-blue-600" />}>
        <div className="flex flex-wrap gap-3 mb-6">
          {["All", "Pending", "On The Way", "Delivered", "Cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                  filter === status
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
        {filteredOrders.length === 0 ? (
          <p className="text-center text-blue-700 font-semibold">
            No orders found for this filter.
          </p>
        ) : (
          <GlassTable
            data={filteredOrders}
            ActionButtons={ActionButtons}
            statusColors={statusColors}
          />
        )}
      </Section>
    </div>
  );
}

// Section Wrapper
const Section = ({ title, icon, children }) => (
  <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl transition hover:scale-[1.02]">
    <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-3">
      {icon} {title}
    </h2>
    {children}
  </div>
);

// Glass Table
const GlassTable = ({ data, ActionButtons, statusColors }) => (
  <div className="overflow-x-auto rounded-2xl shadow-lg border border-white/30 backdrop-blur-md">
    <table className="min-w-full text-sm border-separate border-spacing-0">
      <thead className="bg-blue-100 text-blue-800">
        <tr>
          <th className="p-3 text-left">Customer</th>
          <th className="p-3 text-left">Phone</th>
          <th className="p-3 text-left">Has Container</th>
          <th className="p-3 text-left">Delivery</th>
          <th className="p-3 text-left">Status</th>
          <th className="p-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((order) => (
          <tr
            key={order._id}
            className="border-b hover:bg-blue-50 transition transform hover:scale-[1.01]"
          >
            <td className="p-3">{order.customerName}</td>
            <td className="p-3">{order.phone}</td>
            <td className="p-3">{order.hasContainer ? "Yes" : "No"}</td>
            <td className="p-3">{order.delivery ? "Yes" : "Pickup"}</td>
            <td className="p-3">
              <span
                className={`px-2 py-1 rounded-full font-semibold text-xs ${
                  statusColors[order.status] || "bg-gray-200 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </td>
            <td className="p-3">
              <ActionButtons order={order} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
