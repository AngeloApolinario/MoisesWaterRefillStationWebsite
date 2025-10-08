import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, LogOut, AlertCircle } from "lucide-react";

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
        className={`fixed top-20 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 font-semibold text-white z-50 ${
          type === "success" ? "bg-blue-600" : "bg-red-600"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-6 h-6" />
        ) : (
          <AlertCircle className="w-6 h-6" />
        )}
        {message}
      </motion.div>
    </AnimatePresence>
  );
}
