import React, { useState } from "react";
import axios from "axios";
import { PlusCircle, CheckCircle2 } from "lucide-react";

export default function WalkIn() {
  const [walkInOrder, setWalkInOrder] = useState({
    customerName: "",
    phone: "",
    address: "",
    hasContainer: false,
    delivery: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!walkInOrder.customerName || !walkInOrder.phone) {
      alert("Customer name and phone are required!");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:8000/api/admin/walkin", walkInOrder, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccessMsg("Walk-in order added successfully!");
      setWalkInOrder({
        customerName: "",
        phone: "",
        address: "",
        hasContainer: false,
        delivery: false,
      });

      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Error adding walk-in order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-6 py-10">
      <div className="relative bg-white/80 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-2xl w-full max-w-lg p-10 transition-all hover:shadow-blue-200">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md">
            <PlusCircle size={28} />
          </div>
          <h1 className="text-3xl font-bold text-blue-700 tracking-tight">
            Walk-In Order
          </h1>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="mb-4 flex items-center gap-2 text-green-600 font-medium bg-green-50 border border-green-200 px-4 py-3 rounded-xl animate-fade-in">
            <CheckCircle2 className="text-green-500" /> {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              value={walkInOrder.customerName}
              onChange={(e) =>
                setWalkInOrder({ ...walkInOrder, customerName: e.target.value })
              }
              className="w-full p-4 bg-white border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 0912 345 6789"
              value={walkInOrder.phone}
              onChange={(e) =>
                setWalkInOrder({ ...walkInOrder, phone: e.target.value })
              }
              className="w-full p-4 bg-white border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>

          {/* Delivery Option */}
          <div className="flex items-center justify-between gap-4 bg-blue-50/60 border border-blue-100 p-4 rounded-2xl">
            <label className="flex items-center gap-3 text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={walkInOrder.hasContainer}
                onChange={(e) =>
                  setWalkInOrder({
                    ...walkInOrder,
                    hasContainer: e.target.checked,
                  })
                }
                className="w-5 h-5 accent-blue-600 rounded-md border-gray-300"
              />
              Has Container
            </label>

            <label className="flex items-center gap-3 text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={walkInOrder.delivery}
                onChange={(e) =>
                  setWalkInOrder({
                    ...walkInOrder,
                    delivery: e.target.checked,
                    address: e.target.checked ? walkInOrder.address : "",
                  })
                }
                className="w-5 h-5 accent-blue-600 rounded-md border-gray-300"
              />
              Delivery
            </label>
          </div>

          {/* Address Field */}
          {walkInOrder.delivery && (
            <div className="animate-fade-in">
              <label className="block text-gray-700 font-semibold mb-2">
                Delivery Address
              </label>
              <input
                type="text"
                placeholder="Enter delivery address"
                value={walkInOrder.address}
                onChange={(e) =>
                  setWalkInOrder({
                    ...walkInOrder,
                    address: e.target.value,
                  })
                }
                className="w-full p-4 bg-white border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-md ${
              loading
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
            }`}
          >
            {loading ? "Adding Order..." : "Add Walk-In Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
