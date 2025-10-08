import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Droplets, User, LogOut, Box } from "lucide-react";
import { scroller } from "react-scroll";

export default function Navbar({ onAuthClick, user, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollTo = (section) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => {
        scroller.scrollTo(section, {
          duration: 500,
          smooth: true,
          offset: -70,
        });
      }, 100);
    } else {
      scroller.scrollTo(section, {
        duration: 500,
        smooth: true,
        offset: -70,
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <h1
          className="text-2xl font-extrabold text-blue-700 flex items-center gap-2 cursor-pointer"
          onClick={() => handleScrollTo("hero")}
        >
          <Droplets className="text-blue-500 animate-pulse" /> Moises Water
        </h1>

        <div className="hidden md:flex space-x-6">
          {[
            { name: "Home", to: "hero" },
            { name: "About", to: "about" },
            { name: "Services", to: "services" },
            { name: "Pricing", to: "pricing" },
            { name: "Contact", to: "contact" },
          ].map((link) => (
            <button
              key={link.name}
              onClick={() => handleScrollTo(link.to)}
              className="relative cursor-pointer font-semibold text-gray-700 hover:text-blue-500 transition-colors duration-300"
            >
              {link.name}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4 relative">
          {!user ? (
            <button
              onClick={onAuthClick}
              className="px-4 py-2 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
            >
              Login / Register
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
              >
                <User className="w-5 h-5" />
                {user.name}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 z-50">
                  <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-blue-50 transition-colors">
                    <User className="w-4 h-4 text-blue-500" />
                    My Profile
                  </button>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-blue-50 transition-colors"
                    onClick={() => navigate("/my-orders")}
                  >
                    <Box className="w-4 h-4 text-blue-500" />
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      navigate("/");
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          .active-link {
            color: #2563eb; /* blue-600 */
            border-bottom: 2px solid #2563eb;
            transition: all 0.3s ease-in-out;
          }
        `}
      </style>
    </nav>
  );
}
