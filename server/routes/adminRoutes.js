const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");

// ✅ Get all orders with filtering, sorting, and search
router.get("/orders", async (req, res) => {
  try {
    const { status, search, sortBy, delivery } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (delivery) filter.delivery = delivery === "true";
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions =
      sortBy === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .sort(sortOptions);

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ✅ Get all users with filtering and search
router.get("/users", async (req, res) => {
  try {
    const { search, sortBy } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions =
      sortBy === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const users = await User.find(filter)
      .sort(sortOptions)
      .select("name email phone address createdAt");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ✅ Update order status (Completed / Cancelled / Pending)
router.put("/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update order" });
  }
});

// ✅ Add Walk-In Order (fixed and reliable)
router.post("/walkin", async (req, res) => {
  try {
    const { customerName, phone, hasContainer, delivery, address } = req.body;

    if (!customerName || !phone) {
      return res
        .status(400)
        .json({ message: "Customer name and phone are required" });
    }

    let price = 0;
    if (!hasContainer) price = 200;
    else price = delivery ? 30 : 25;

    const newOrder = new Order({
      customerName,
      phone,
      address: delivery ? address || "Walk-in" : "",
      hasContainer,
      delivery,
      price,
      status: "Completed", // Walk-ins are usually instant
    });

    await newOrder.save();
    res.status(201).json({
      message: "Walk-in order created successfully!",
      order: newOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create walk-in order" });
  }
});

// ✅ Monthly Sales Summary (current month)
router.get("/sales/monthly", async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const completedOrders = await Order.find({
      status: "Completed",
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const totalSales = completedOrders.reduce(
      (sum, order) => sum + order.price,
      0
    );
    const totalOrders = completedOrders.length;

    res.json({
      month: now.toLocaleString("default", { month: "long" }),
      totalSales,
      totalOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch monthly sales" });
  }
});

module.exports = router;
