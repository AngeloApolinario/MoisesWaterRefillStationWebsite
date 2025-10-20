import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Droplets, User, LogOut, Box } from "lucide-react";
import { scroller } from "react-scroll";

export default function Navbar({ onAuthClick, user, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const sections = ["home", "about", "services", "pricing", "contact"];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Track scroll position to set active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 80; // offset for navbar
      let current = "home";

      sections.forEach((section) => {
        const el = document.getElementById(section);
        if (el && el.offsetTop <= scrollY) {
          current = section;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        {/* Logo */}
        <h1
          className="text-2xl font-extrabold text-blue-700 flex items-center gap-2 cursor-pointer"
          onClick={() => handleScrollTo("home")}
        >
          <Droplets className="text-blue-500 animate-pulse" /> Moises Water
        </h1>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => handleScrollTo(section)}
              className={`relative cursor-pointer font-semibold text-gray-700 hover:text-blue-500 transition-colors duration-300 ${
                activeSection === section
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : ""
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Auth / Profile Section */}
        <div className="flex items-center space-x-4 relative">
          {!user ? (
            <button
              onClick={onAuthClick}
              className="px-4 py-2 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
            >
              Login / Register
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
              >
                <User className="w-5 h-5" />
                {user.name}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 z-50">
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-blue-50 transition-colors"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <User className="w-4 h-4 text-blue-500" />
                    My Profile
                  </button>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-blue-50 transition-colors"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/my-orders");
                    }}
                  >
                    <Box className="w-4 h-4 text-blue-500" />
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsDropdownOpen(false);
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
    </nav>
  );
}
