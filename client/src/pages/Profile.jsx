import React, { useState } from "react";
import axios from "axios";
import { Droplets } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile({ user, setUser }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
    phone: user?.phone || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.put(
        `http://localhost:5000/api/auth/users/${user._id}`,
        formData
      );
      setUser(res.data);
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Bubbles array
  const bubbles = [
    { size: 20, x: "10%", delay: 0 },
    { size: 30, x: "25%", delay: 1 },
    { size: 15, x: "50%", delay: 2 },
    { size: 25, x: "70%", delay: 1.5 },
    { size: 18, x: "85%", delay: 0.5 },
    { size: 22, x: "40%", delay: 1.2 },
    { size: 28, x: "60%", delay: 0.8 },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-sky-100 to-blue-200 flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Bubbles */}
      {bubbles.map((b, idx) => (
        <motion.div
          key={idx}
          className="absolute bg-white rounded-full opacity-40 z-0"
          style={{ width: b.size, height: b.size, left: b.x, bottom: 0 }}
          animate={{
            y: ["0%", "-350%"],
            scale: [1, 1.2, 1.5, 0],
            opacity: [0.3, 0.7, 1, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 3,
            repeat: Infinity,
            repeatType: "loop",
            delay: b.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main Container */}
      <div className="relative bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-2xl border border-white/40 z-10 overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sky-200/40 rounded-full blur-3xl animate-pulse"></div>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-sky-400 p-4 rounded-full shadow-md mb-3">
            <Droplets className="w-8 h-8 text-white animate-bounce" />
          </div>
          <h2 className="text-3xl font-bold text-blue-700 drop-shadow-sm">
            My Profile
          </h2>
          <p className="text-gray-600 text-sm">
            Manage your account details below 💧
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {[
            { name: "name", label: "Full Name", type: "text" },
            { name: "email", label: "Email Address", type: "email" },
            { name: "address", label: "Address", type: "text" },
            { name: "phone", label: "Phone Number", type: "text" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full border border-blue-200 rounded-lg px-4 pt-5 pb-2 bg-white/60 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 placeholder-transparent"
              />
              <label
                htmlFor={field.name}
                className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-blue-600 peer-focus:text-sm"
              >
                {field.label}
              </label>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            {loading ? "💧 Saving..." : "Save Changes"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-6 text-center font-semibold ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
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
