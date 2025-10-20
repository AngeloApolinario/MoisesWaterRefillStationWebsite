import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "moises123";

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdminLoggedIn", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  const droplets = [
    { size: 8, x: "10%", delay: 0 },
    { size: 6, x: "30%", delay: 0.3 },
    { size: 10, x: "50%", delay: 0.6 },
    { size: 5, x: "70%", delay: 0.9 },
    { size: 7, x: "90%", delay: 1.2 },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-100 to-sky-200 overflow-hidden flex items-center justify-center">
      {/* Floating droplets */}
      {droplets.map((d, idx) => (
        <motion.div
          key={idx}
          className="absolute bg-white/40 rounded-full"
          style={{ width: d.size, height: d.size, left: d.x, top: "90%" }}
          animate={{
            y: ["0%", "-120%", "0%"],
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 6 + Math.random() * 2,
            repeat: Infinity,
            delay: d.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Wave Background */}
      <svg
        className="absolute bottom-0 w-full h-40 z-0"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <motion.path
          fill="#ffffff"
          fillOpacity="0.3"
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
      </svg>

      {/* Glassmorphic login card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-[90%] max-w-md border border-white/30"
      >
        <h2 className="text-3xl font-extrabold text-blue-800 text-center mb-6 drop-shadow-md">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, backgroundColor: "#1e40af" }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            Login
          </motion.button>
        </form>

        {/* Floating small accent bubbles */}
        <motion.div
          className="absolute -top-4 -left-4 w-6 h-6 bg-blue-300/50 rounded-full"
          animate={{ y: [0, 20, 0], x: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-4 -right-4 w-4 h-4 bg-sky-300/40 rounded-full"
          animate={{ y: [0, -20, 0], x: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
