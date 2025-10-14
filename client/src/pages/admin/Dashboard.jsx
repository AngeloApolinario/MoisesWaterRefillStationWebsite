import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Droplets,
  Users,
  ClipboardList,
  CheckCircle,
  XCircle,
  Plus,
  TrendingUp,
  Star,
} from "lucide-react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [walkInOrder, setWalkInOrder] = useState({
    customerName: "",
    phone: "",
    address: "",
    hasContainer: false,
    delivery: false,
  });

  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    onTheWay: 0,
    delivered: 0,
    cancelled: 0,
    monthlySales: 0,
    topBuyer: null,
  });

  // Fetch all orders, users, and monthly sales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, userRes, salesRes] = await Promise.all([
          axios.get("http://localhost:8000/api/admin/orders"),
          axios.get("http://localhost:8000/api/admin/users"),
          axios.get("http://localhost:8000/api/admin/sales/monthly"),
        ]);

        setOrders(orderRes.data);
        setUsers(userRes.data);

        // Calculate stats
        const counts = {
          totalOrders: orderRes.data.length,
          pending: orderRes.data.filter((o) => o.status === "Pending").length,
          onTheWay: orderRes.data.filter((o) => o.status === "On The Way")
            .length,
          delivered: orderRes.data.filter((o) => o.status === "Delivered")
            .length,
          cancelled: orderRes.data.filter((o) => o.status === "Cancelled")
            .length,
          monthlySales: salesRes.data.totalSales || 0,
        };

        // Calculate top buyer
        const buyerMap = {};
        orderRes.data.forEach((o) => {
          if (o.user && o.user.name) {
            buyerMap[o.user.name] = (buyerMap[o.user.name] || 0) + 1;
          }
        });

        const topBuyerName =
          Object.keys(buyerMap).length > 0
            ? Object.entries(buyerMap).sort((a, b) => b[1] - a[1])[0][0]
            : null;

        counts.topBuyer = topBuyerName;

        setStats(counts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/api/admin/orders/${id}`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleWalkInSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/admin/walkin", walkInOrder);
      alert("Walk-in order added successfully!");
      setWalkInOrder({
        customerName: "",
        phone: "",
        address: "",
        hasContainer: false,
        delivery: false,
      });
    } catch (err) {
      console.error(err);
      alert("Error creating walk-in order.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-sky-100 to-blue-200 p-10">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-10 text-center flex items-center justify-center gap-3">
        <Droplets className="text-blue-600 animate-pulse" /> Admin Dashboard
      </h1>

      {/* STATISTICS */}
      <div className="grid md:grid-cols-7 sm:grid-cols-2 gap-6 mb-10">
        <StatCard
          icon={<ClipboardList />}
          label="Total Orders"
          value={stats.totalOrders}
        />
        <StatCard icon={<Users />} label="Users" value={users.length} />
        <StatCard icon={<Droplets />} label="Pending" value={stats.pending} />
        <StatCard
          icon={<CheckCircle />}
          label="Delivered"
          value={stats.delivered}
        />
        <StatCard
          icon={<XCircle />}
          label="Cancelled"
          value={stats.cancelled}
        />
        <StatCard
          icon={<TrendingUp />}
          label="Sales This Month"
          value={`₱${stats.monthlySales}`}
        />
        <StatCard
          icon={<Star />}
          label="Top Buyer"
          value={stats.topBuyer || "N/A"}
        />
      </div>

      {/* ORDERS SECTION */}
      <section className="bg-white p-6 rounded-2xl shadow-xl mb-10">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Manage Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-blue-50">
                  <td className="p-3">{order.customerName}</td>
                  <td className="p-3">{order.phone}</td>
                  <td className="p-3 font-semibold text-blue-700">
                    {order.status}
                  </td>
                  <td className="p-3 space-x-2">
                    {["Pending", "On The Way", "Delivered", "Cancelled"].map(
                      (s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusUpdate(order._id, s)}
                          className={`px-2 py-1 rounded-lg text-white text-xs font-semibold ${
                            s === "Delivered"
                              ? "bg-green-500"
                              : s === "Cancelled"
                              ? "bg-red-500"
                              : s === "On The Way"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {s}
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* USERS SECTION */}
      <section className="bg-white p-6 rounded-2xl shadow-xl mb-10">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          Registered Users
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-blue-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* WALK-IN ORDER FORM */}
      <section className="bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
          <Plus className="text-blue-500" /> Add Walk-In Order
        </h2>
        <form
          onSubmit={handleWalkInSubmit}
          className="grid md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Customer Name"
            value={walkInOrder.customerName}
            onChange={(e) =>
              setWalkInOrder({ ...walkInOrder, customerName: e.target.value })
            }
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={walkInOrder.phone}
            onChange={(e) =>
              setWalkInOrder({ ...walkInOrder, phone: e.target.value })
            }
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Address (optional)"
            value={walkInOrder.address}
            onChange={(e) =>
              setWalkInOrder({ ...walkInOrder, address: e.target.value })
            }
            className="p-3 border rounded-lg md:col-span-2"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={walkInOrder.hasContainer}
              onChange={(e) =>
                setWalkInOrder({
                  ...walkInOrder,
                  hasContainer: e.target.checked,
                })
              }
            />
            <label>Has Container</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={walkInOrder.delivery}
              onChange={(e) =>
                setWalkInOrder({ ...walkInOrder, delivery: e.target.checked })
              }
            />
            <label>Delivery</label>
          </div>
          <button
            type="submit"
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Add Walk-In Order
          </button>
        </form>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 text-center border border-blue-100 hover:shadow-2xl transition duration-300">
      <div className="flex justify-center text-blue-600 mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-blue-900">{label}</h3>
      <p className="text-2xl font-extrabold text-blue-700">{value}</p>
    </div>
  );
}
