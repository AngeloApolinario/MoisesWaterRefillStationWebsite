import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { UserCheck, AlertCircle } from "lucide-react";

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const switchMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:8000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        setMessageType("success");
        setMessage(`Welcome back, ${res.data.user?.name || "Hydrated Hero"}!`);
        onLogin(res.data.user);
      } else {
        await axios.post("http://localhost:8000/api/auth/register", formData);
        setMessageType("success");
        setMessage("Registration successful! You can now log in.");
      }

      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.error(err.response?.data || err);
      setMessageType("error");
      const errMsg = err.response?.data?.message?.toLowerCase() || "";
      if (errMsg.includes("password")) {
        setMessage("Oops! That password doesn’t flow right — try again.");
      } else if (errMsg.includes("email")) {
        setMessage("This email is already in our system. Try logging in?");
      } else {
        setMessage("Something went wrong. Please try again soon!");
      }
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white/30 backdrop-blur-md w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          {/* LEFT SIDE */}
          <div className="relative bg-gradient-to-b from-blue-400 via-sky-400 to-blue-500 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              className="absolute w-64 h-64 bg-blue-300 rounded-full blur-3xl opacity-40 animate-pulse"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 6 }}
            />
            <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
              {isLogin ? "Welcome Back!" : "Join Us!"}
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Refresh your day with crystal-clear hydration.
            </p>
            <button
              onClick={switchMode}
              className="px-6 py-3 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:scale-105 hover:bg-white/90 transition-all duration-300"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </div>

          <div className="p-10 flex flex-col justify-center relative">
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mb-4 px-6 py-3 rounded-xl shadow-lg font-semibold text-center flex items-center justify-center gap-2 ${
                  messageType === "success"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {messageType === "success" ? (
                  <UserCheck className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                {message}
              </motion.div>
            )}

            <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
              {isLogin ? "Login" : "Register"}
            </h2>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {!isLogin && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition"
                    required
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition"
                  />
                </>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-400 via-sky-400 to-blue-500 text-white font-bold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                {loading
                  ? isLogin
                    ? "Logging in..."
                    : "Registering..."
                  : isLogin
                  ? "Login"
                  : "Register"}
              </button>
            </motion.form>

            <p className="mt-4 text-center text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                onClick={switchMode}
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
              >
                {isLogin ? "Register" : "Login"}
              </span>
            </p>

            <button
              onClick={onClose}
              className="mt-6 w-full py-2 text-center text-gray-500 hover:text-gray-700 transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
