import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserPlus, Trash2, Edit } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const [searchQuery, setSearchQuery] = useState(""); // <-- Search state
  const streets = [
    "Arrocena Street",
    "Castanieto Street",
    "Castillo Street",
    "Corpuz Street",
    "Esperanza Street",
    "Fabros Street",
    "Felix Street",
    "Labiano Street",
    "Lagasca Street",
    "Mendoza Street",
    "Natividad Street",
    "Paras Street",
    "Reyes Street",
    "Sevilla Street",
    "Silao Street",
    "Taguan Street",
    "Vicencio Street",
  ];

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingUser) {
        await axios.put(
          `http://localhost:8000/api/admin/users/${editingUser._id}`,
          form
        );
        setMessage("User updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/admin/users", form);
        setMessage("User added successfully!");
      }
      setForm({ name: "", email: "", password: "", address: "", phone: "" });
      setEditingUser(null);
      fetchUsers();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Error saving user.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setMessage("User deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Error deleting user.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "", // keep blank for security
      address: user.address || "",
      phone: user.phone || "",
    });
  };

  // 🔹 Filter users based on search query
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-blue-800 flex items-center gap-3">
          <UserPlus className="text-blue-600 animate-pulse" /> Manage Users
        </h1>
      </div>

      {/* Success Message */}
      {message && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-800 font-semibold shadow-md flex items-center gap-2 animate-fade-in">
          {message}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-xl border border-blue-100 p-6 rounded-3xl shadow-lg grid md:grid-cols-3 gap-4 mb-6 transition-all hover:shadow-xl"
      >
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required={!editingUser}
          className="p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm"
        />
        <select
          name="address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm"
          required
        >
          <option value="" disabled>
            Select a street
          </option>
          {streets.map((street) => (
            <option key={street} value={street}>
              {street}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className={`md:col-span-3 py-3 mt-2 rounded-2xl text-white font-semibold transition-all shadow-md ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
          }`}
        >
          {editingUser ? "Update User" : "Add User"}
        </button>
      </form>

      {/* 🔍 Search Input */}
      <div className="mb-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white/80 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-lg p-6 overflow-x-auto transition hover:shadow-xl">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-blue-100 text-blue-800 rounded-t-2xl">
            <tr>
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Password</th>
              <th className="p-3 text-left font-semibold">Address</th>
              <th className="p-3 text-left font-semibold">Phone</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((u) => (
              <tr
                key={u._id}
                className="hover:bg-blue-50 transition cursor-pointer"
              >
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">******</td>
                <td className="p-3">{u.address}</td>
                <td className="p-3">{u.phone}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(u)}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white transition"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
