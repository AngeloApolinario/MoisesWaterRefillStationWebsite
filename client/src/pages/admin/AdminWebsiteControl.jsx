import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminWebsiteControl() {
  const [enabled, setEnabled] = useState(true);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:8000/api/admin/website-status";

  // Fetch current website status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(API_URL);
        setEnabled(res.data.enabled);
        setReason(res.data.reason || "");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch website status");
      }
    };
    fetchStatus();
  }, []);

  const handleToggle = async () => {
    setError("");
    // Validate reason if disabling
    if (enabled && reason.trim() === "") {
      setError("Please provide a reason for disabling the website.");
      return;
    }

    setLoading(true);
    try {
      const newStatus = !enabled;
      await axios.put(API_URL, {
        enabled: newStatus,
        reason: newStatus ? "" : reason,
      });
      setEnabled(newStatus);
      alert(`Website is now ${newStatus ? "enabled" : "disabled"}`);
      if (!newStatus) setReason(""); // clear reason after disabling
    } catch (err) {
      console.error(err);
      setError("Failed to update website status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-2xl max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Website Control Panel
      </h2>

      <p className="mb-4 text-gray-600">
        Current Status:{" "}
        <span
          className={`font-semibold ${
            enabled ? "text-green-600" : "text-red-600"
          }`}
        >
          {enabled ? "Enabled" : "Disabled"}
        </span>
      </p>

      {/* Show reason input only when disabling */}
      {enabled && (
        <input
          type="text"
          placeholder="Reason for disabling"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border border-gray-300 p-3 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      )}

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <button
        onClick={handleToggle}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
          enabled
            ? "bg-red-500 hover:bg-red-600 shadow-lg"
            : "bg-green-500 hover:bg-green-600 shadow-lg"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading
          ? "Processing..."
          : enabled
          ? "Disable Website"
          : "Enable Website"}
      </button>

      {enabled && (
        <p className="mt-2 text-sm text-gray-500">
          Provide a reason why the website is being disabled.
        </p>
      )}
    </div>
  );
}
