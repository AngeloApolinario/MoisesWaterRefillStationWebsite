import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Order({ handleProtectedAction, user }) {
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [hasContainer, setHasContainer] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const bubbles = [
    { size: 30, x: "5%", delay: 0 },
    { size: 20, x: "80%", delay: 1 },
    { size: 25, x: "50%", delay: 0.5 },
    { size: 15, x: "30%", delay: 1.2 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderAction = async () => {
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:8000/api/orders", {
          customerName,
          phone,
          address,
          hasContainer,
          delivery,
          user: user._id,
        });
        setMessage(res.data.message || "Order placed successfully!");
        setLoading(false);
        setCustomerName(user?.name || "");
        setPhone(user?.phone || "");
        setAddress(user?.address || "");
        setHasContainer(false);
        setDelivery(false);
      } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.message || "Something went wrong");
        setLoading(false);
      }
    };

    handleProtectedAction(orderAction);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-sky-100 to-blue-200 flex items-center justify-center py-10 overflow-hidden">
      {bubbles.map((b, idx) => (
        <motion.div
          key={idx}
          className="absolute bg-white/30 rounded-full"
          style={{ width: b.size, height: b.size, left: b.x, bottom: 0 }}
          animate={{
            y: ["0%", "-400%"],
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 2,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-6xl bg-gradient-to-br from-blue-100 via-sky-200 to-blue-300 shadow-2xl rounded-3xl p-10 flex flex-col md:flex-row gap-10"
      >
        <div className="md:w-1/2">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-6 text-center drop-shadow-lg">
            Place Your Order
          </h2>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 text-blue-900 p-3 rounded-lg mb-6 text-center font-medium shadow-md"
            >
              {message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Name"
              required
              className="w-full border border-blue-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              required
              className="w-full border border-blue-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <select
              value={hasContainer}
              onChange={(e) => setHasContainer(e.target.value === "true")}
              className="w-full border border-blue-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value={false}>No (₱200)</option>
              <option value={true}>Yes (₱25 pickup / ₱30 delivery)</option>
            </select>
            {hasContainer && (
              <select
                value={delivery}
                onChange={(e) => setDelivery(e.target.value === "true")}
                className="w-full border border-blue-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value={false}>Pickup (₱25)</option>
                <option value={true}>Delivery (₱30)</option>
              </select>
            )}
            {delivery && (
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                required
                className="w-full border border-blue-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            )}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-gradient-to-r from-blue-500 via-sky-500 to-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? "Processing..." : "Place Order"}
            </motion.button>
          </form>
        </div>

        <div className="md:w-1/2 flex flex-col justify-center text-blue-900 space-y-5">
          <h3 className="text-3xl font-bold text-center md:text-left mb-4">
            How to Order
          </h3>
          <ul className="list-disc ml-5 space-y-3 text-lg">
            <li>
              Select if you already have a water container. If not, a container
              will cost ₱200.
            </li>
            <li>
              Pickup price: ₱25 | Delivery price: ₱30 (only if you already have
              a container).
            </li>
            <li>Fill in your name and phone number.</li>
            <li>For delivery orders, provide your complete address.</li>
            <li>
              Click “Place Order” and enjoy fresh, purified water at your home!
            </li>
          </ul>
          <div className="mt-5 p-4 bg-blue-100 rounded-xl shadow-inner text-center">
            <strong>Tip:</strong> Stay hydrated and always reuse your water
            containers to help the environment!
          </div>
        </div>
      </motion.div>
    </div>
  );
}
