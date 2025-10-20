import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import Toast from "./components/Toast";
import Home from "./pages/Home";
import Order from "./pages/Order";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminApp from "./pages/admin/AdminApp";

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthOpen(false);
    setToast({ message: "Login successful! Welcome back.", type: "success" });
  };

  const handleLogout = () => {
    setUser(null);
    setToast({ message: "You have successfully logged out.", type: "success" });
  };

  const handleProtectedAction = (action) => {
    if (user) {
      action();
    } else {
      setIsAuthOpen(true);
      setToast({ message: "Please log in to continue.", type: "error" });
    }
  };

  return (
    <Router>
      {!window.location.pathname.startsWith("/admin") && (
        <Navbar
          onAuthClick={() => setIsAuthOpen(true)}
          user={user}
          onLogout={handleLogout}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      <div
        className={
          !window.location.pathname.startsWith("/admin") ? "pt-16" : ""
        }
      >
        <Routes>
          {/* User routes */}
          <Route
            path="/"
            element={<Home handleProtectedAction={handleProtectedAction} />}
          />
          <Route
            path="/order"
            element={
              <Order
                handleProtectedAction={handleProtectedAction}
                user={user}
              />
            }
          />
          <Route path="/my-orders" element={<MyOrders user={user} />} />
          <Route
            path="/profile"
            element={<Profile user={user} setUser={setUser} />}
          />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
