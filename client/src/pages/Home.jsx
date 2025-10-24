import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Droplets,
  Info,
  ShoppingBag,
  Users,
  Home,
  CheckCircle,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HomePage({ handleProtectedAction }) {
  const navigate = useNavigate();
  const [websiteStatus, setWebsiteStatus] = useState({
    enabled: true,
    reason: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admin/website-status")
      .then((res) => {
        setWebsiteStatus(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch website status:", err);
      });
  }, []);

  const bubbles = [
    { size: 20, x: "10%", delay: 0 },
    { size: 30, x: "25%", delay: 1 },
    { size: 15, x: "50%", delay: 2 },
    { size: 25, x: "70%", delay: 1.5 },
    { size: 18, x: "85%", delay: 0.5 },
    { size: 22, x: "40%", delay: 1.2 },
    { size: 28, x: "60%", delay: 0.8 },
  ];

  const sectionBlob = (size, top, left, opacity, color) => (
    <div
      className={`absolute ${size} ${top} ${left} ${color} rounded-full blur-3xl`}
      style={{ opacity }}
    />
  );

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 text-gray-900 relative">
      {/* WEBSITE UNAVAILABLE OVERLAY */}
      {!websiteStatus.enabled && (
        <div className="absolute inset-0 z-50 bg-black/70 flex flex-col items-center justify-center text-center px-4">
          <motion.h2
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-red-500 mb-4"
          >
            Website Unavailable
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white text-lg"
          >
            Sorry, we are not accepting orders right now.
          </motion.p>
          {websiteStatus.reason && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white mt-2 font-semibold"
            >
              Reason: {websiteStatus.reason}
            </motion.p>
          )}
        </div>
      )}

      {/* HERO SECTION */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-200 via-blue-300 to-sky-400 text-center px-6 overflow-hidden"
      >
        {/* Background blobs */}
        <div className="absolute w-[900px] h-[900px] bg-blue-500 rounded-full blur-3xl -top-40 -left-20 opacity-40 animate-pulse-slow z-0" />
        <div className="absolute w-[700px] h-[700px] bg-sky-300 rounded-full blur-3xl -bottom-40 -right-20 opacity-30 animate-pulse-slow z-0" />
        <svg
          className="absolute bottom-0 w-full h-40 z-10"
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
        {/* Floating bubbles */}
        {bubbles.map((b, idx) => (
          <motion.div
            key={idx}
            className="absolute bg-white rounded-full opacity-40 z-20"
            style={{
              width: b.size,
              height: b.size,
              left: b.x,
              bottom: 60,
            }}
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

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl z-20"
        >
          <h2 className="text-6xl font-extrabold text-white drop-shadow-lg">
            Pure Water, Pure Life
          </h2>
          <p className="mt-6 text-lg text-blue-50">
            Refresh your body and soul with the cleanest, safest water in town.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() =>
                websiteStatus.enabled
                  ? handleProtectedAction(() => navigate("/order"))
                  : null
              }
              className={`px-6 py-3 text-white rounded-2xl shadow-lg flex items-center gap-2 ${
                websiteStatus.enabled
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
            >
              <ShoppingBag size={18} /> Order Now
            </button>
            <button
              onClick={() => {
                const aboutSection = document.getElementById("about");
                if (aboutSection)
                  aboutSection.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 border border-white text-white rounded-2xl hover:bg-white/20 transition flex items-center gap-2"
            >
              <Info size={18} /> Learn More
            </button>
          </div>
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="relative py-20 px-6 max-w-6xl mx-auto text-center bg-white overflow-hidden"
      >
        {sectionBlob("w-80 h-80", "-top-20", "-left-10", 0.3, "bg-blue-200")}
        {sectionBlob(
          "w-60 h-60",
          "-bottom-10",
          "-right-10",
          0.25,
          "bg-sky-300"
        )}

        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold text-blue-900 relative z-10 flex items-center justify-center gap-2"
        >
          About Us
        </motion.h3>
        <p className="mt-6 text-lg text-gray-700 leading-relaxed relative z-10">
          Moises Water Refill Station is dedicated to delivering life’s most
          essential resource —{" "}
          <strong>pure, clean, and refreshing water</strong>. With
          state-of-the-art purification systems and eco-friendly refilling, we
          make sure you and your family stay healthy and hydrated.
        </p>
      </section>

      {/* SERVICES SECTION */}
      <section
        id="services"
        className="relative py-20 bg-gradient-to-b from-blue-50 to-blue-100 px-6 overflow-hidden"
      >
        {sectionBlob("w-80 h-80", "-top-10", "-right-20", 0.2, "bg-blue-300")}
        {sectionBlob("w-60 h-60", "-bottom-20", "-left-10", 0.25, "bg-sky-200")}

        <h3 className="text-4xl font-bold text-center text-blue-900 flex items-center justify-center gap-2 relative z-10">
          <Droplets className="text-blue-600" /> Our Services
        </h3>
        <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
          {[
            {
              icon: Home,
              title: "Home Delivery",
              desc: "Convenient doorstep delivery for your family.",
            },
            {
              icon: Droplets,
              title: "Refill Station",
              desc: "Eco-friendly walk-in refills at our store.",
            },
            {
              icon: CheckCircle,
              title: "Water Purification",
              desc: "State-of-the-art purification technology.",
            },
          ].map((service, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="p-8 bg-white rounded-2xl shadow-lg text-center border-t-4 border-blue-400"
            >
              <service.icon className="mx-auto text-blue-600 w-12 h-12" />
              <h4 className="mt-4 text-xl font-semibold">{service.title}</h4>
              <p className="mt-2 text-gray-600">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section
        id="testimonials"
        className="relative py-20 bg-gradient-to-b from-sky-100 to-white px-6 overflow-hidden"
      >
        {sectionBlob("w-72 h-72", "-top-10", "-left-20", 0.2, "bg-blue-200")}
        {sectionBlob(
          "w-60 h-60",
          "-bottom-10",
          "-right-10",
          0.25,
          "bg-sky-300"
        )}

        <h3 className="text-4xl font-bold text-center text-blue-900 flex items-center justify-center gap-2 relative z-10">
          <Users className="text-blue-600" /> Customer Testimonials
        </h3>
        <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
          {[
            {
              name: "Maria Santos",
              text: "The water tastes fresh and clean. I won’t drink from anywhere else!",
            },
            {
              name: "Juan Dela Cruz",
              text: "Super fast delivery and affordable prices. Highly recommend!",
            },
            {
              name: "Ana Reyes",
              text: "I trust Moises Water for my family’s daily hydration needs.",
            },
          ].map((t, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-2xl shadow-lg relative"
            >
              <Users className="w-10 h-10 text-blue-600" />
              <p className="mt-4 text-gray-700 italic">"{t.text}"</p>
              <p className="mt-2 font-semibold text-blue-900">- {t.name}</p>
              <motion.div
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section
        id="pricing"
        className="relative py-20 bg-gradient-to-b from-blue-100 to-blue-200 px-6 overflow-hidden"
      >
        {sectionBlob("w-80 h-80", "-top-10", "-left-20", 0.25, "bg-sky-300")}
        {sectionBlob(
          "w-60 h-60",
          "-bottom-10",
          "-right-10",
          0.2,
          "bg-blue-200"
        )}

        <h3 className="text-4xl font-bold text-center text-blue-900 flex items-center justify-center gap-2 relative z-10">
          <ShoppingBag className="text-blue-600" /> Pricing
        </h3>
        <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
          {[
            { plan: "No Container", price: "₱200", desc: "Per 5 Gallons" },
            { plan: "Delivery Plan", price: "₱30", desc: "Per delivery" },
            { plan: "Pickup Plan", price: "₱25", desc: "Per refill" },
          ].map((p, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="p-8 bg-white rounded-2xl shadow-lg text-center border-b-4 border-blue-500"
            >
              <h4 className="text-xl font-semibold">{p.plan}</h4>
              <p className="mt-2 text-3xl font-bold text-blue-600">{p.price}</p>
              <p className="mt-2 text-gray-600">{p.desc}</p>
              <button
                disabled={!websiteStatus.enabled}
                className={`mt-6 px-6 py-3 rounded-xl font-bold transition ${
                  websiteStatus.enabled
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-500 text-white cursor-not-allowed"
                }`}
              >
                Choose Plan
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        id="cta"
        className="relative py-20 bg-gradient-to-r from-blue-500 via-sky-500 to-blue-600 text-white text-center overflow-hidden"
      >
        {sectionBlob("w-72 h-72", "-top-10", "-right-20", 0.25, "bg-blue-300")}
        {sectionBlob("w-60 h-60", "-bottom-10", "-left-10", 0.2, "bg-sky-200")}

        <h3 className="text-4xl font-extrabold flex items-center justify-center gap-2 relative z-10">
          <Droplets /> Stay Hydrated Today
        </h3>
        <p className="mt-4 text-lg relative z-10">
          Order now and enjoy refreshing water straight from Moises Water.
        </p>
        <button
          onClick={() =>
            websiteStatus.enabled
              ? handleProtectedAction(() => navigate("/order"))
              : null
          }
          className={`mt-6 m-auto px-8 py-3 rounded-2xl font-bold shadow-lg flex items-center gap-2 relative z-10 ${
            websiteStatus.enabled
              ? "bg-white text-blue-600 hover:bg-gray-100"
              : "bg-gray-500 text-white cursor-not-allowed"
          }`}
        >
          <ShoppingBag size={18} /> Get Started
        </button>
      </section>

      {/* FOOTER */}
      <footer
        id="contact"
        className="relative bg-gray-900 text-gray-300 py-12 overflow-hidden"
      >
        {sectionBlob("w-80 h-80", "-top-10", "-left-10", 0.2, "bg-blue-500")}
        {sectionBlob(
          "w-60 h-60",
          "-bottom-10",
          "-right-10",
          0.25,
          "bg-sky-400"
        )}

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 relative z-10">
          <div>
            <h4 className="text-xl font-bold text-white flex items-center gap-2">
              <Droplets className="text-blue-400" /> Moises Water
            </h4>
            <p className="mt-2">
              Bringing you safe, affordable, and refreshing water every day.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">Quick Links</h4>
            <ul className="mt-2 space-y-2">
              <li>Home</li>
              <li>About</li>
              <li>Services</li>
              <li>Pricing</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">Contact Us</h4>
            <p className="mt-2 flex items-center gap-2">
              <Home size={16} /> 084, San Francisco, Llanera, Nueva Ecija
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} /> +63 950 467 8234
            </p>
            <p className="flex items-center gap-2">
              <Info size={16} /> moiseswater@gmail.com
            </p>

            {/* Google Map Embed */}
            <div className="mt-4 w-full h-48 rounded-xl overflow-hidden shadow-lg">
              <iframe
                title="Moises Water Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3851.123456789!2d121.0054321!3d15.6765432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33962f2b4f123456%3A0xabcdef123456789!2sSan+Francisco%2C+Llanera%2C+Nueva+Ecija!5e0!3m2!1sen!2sph!4v1690000000000!5m2!1sen!2sph"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="text-center mt-10 text-sm text-gray-500 relative z-10">
          © {new Date().getFullYear()} Moises Water Refill Station. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
