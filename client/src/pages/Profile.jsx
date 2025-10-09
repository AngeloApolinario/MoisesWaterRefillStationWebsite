import React, { useState } from "react";
import axios from "axios";
import { Droplets } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-sky-100 to-blue-200 flex items-center justify-center px-4 py-12">
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-2xl border border-white/40 relative overflow-hidden">
        {/* Decorative floating water droplet */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sky-200/40 rounded-full blur-3xl animate-pulse"></div>

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Floating Input Field */}
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
    </div>
  );
}
