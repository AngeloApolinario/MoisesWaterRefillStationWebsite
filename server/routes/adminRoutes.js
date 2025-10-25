const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const WebsiteStatus = require("../models/WebsiteStatus");

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

router.post("/walkin", async (req, res) => {
  try {
    const { customerName, phone, hasContainer, delivery, address } = req.body;

    if (!customerName || !phone) {
      return res
        .status(400)
        .json({ message: "Customer name and phone are required." });
    }

    let price = 0;
    if (!hasContainer) price = 200;
    else price = delivery ? 30 : 25;

    const newOrder = new Order({
      customerName,
      phone,
      address: delivery ? address || "N/A" : "Walk-in",
      hasContainer,
      delivery,
      price,
      status: "Delivered",
    });

    await newOrder.save();

    res.status(201).json({
      message: "Walk-in order created successfully!",
      order: newOrder,
    });
  } catch (err) {
    console.error("❌ Error creating walk-in order:", err);
    res.status(500).json({ message: "Failed to create walk-in order." });
  }
});

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

// ✅ Create User
router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to create user" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // For yearly: start of year and maybe last year
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    // Base match: status is Delivered etc
    const baseMatch = {
      status: "Delivered",
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    };

    // Totals for current month
    const totalSalesStage = {
      $group: {
        _id: null,
        totalSales: { $sum: "$price" },
        totalOrders: { $sum: 1 },
        walkInOrders: {
          $sum: { $cond: [{ $eq: ["$delivery", false] }, 1, 0] },
        },
        deliveryOrders: {
          $sum: { $cond: [{ $eq: ["$delivery", true] }, 1, 0] },
        },
      },
    };

    // Daily last 7 days
    const dailySalesStage = {
      $group: {
        _id: { day: { $dayOfWeek: "$createdAt" } },
        total: { $sum: "$price" },
      },
    };

    // Monthly comparisons: current month vs previous
    const monthlyCompMatch = {
      status: "Delivered",
      createdAt: { $gte: prevMonthStart, $lte: endOfMonth },
    };
    const monthlyCompStage = {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        total: { $sum: "$price" },
        orders: { $sum: 1 },
      },
    };

    // Yearly sales: this year vs last year
    const yearlyMatch = {
      status: "Delivered",
      createdAt: {
        $gte: new Date(now.getFullYear() - 1, 0, 1),
        $lte: endOfYear,
      },
    };
    const yearlyStage = {
      $group: {
        _id: { year: { $year: "$createdAt" } },
        total: { $sum: "$price" },
        orders: { $sum: 1 },
      },
    };

    // Top buyers
    const topBuyersStage = {
      $group: {
        _id: "$customerName",
        totalSpent: { $sum: "$price" },
      },
    };

    const totals =
      (await Order.aggregate([{ $match: baseMatch }, totalSalesStage]))[0] ||
      {};
    const dailyResults = await Order.aggregate([
      { $match: baseMatch },
      dailySalesStage,
      { $sort: { "_id.day": 1 } },
    ]);
    const monthlyResults = await Order.aggregate([
      { $match: monthlyCompMatch },
      monthlyCompStage,
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    const yearlyResults = await Order.aggregate([
      { $match: yearlyMatch },
      yearlyStage,
      { $sort: { "_id.year": 1 } },
    ]);
    const topBuyersResults = await Order.aggregate([
      { $match: baseMatch },
      topBuyersStage,
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
    ]);

    // Format daily into last 7 days
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      last7Days.push(dayNames[d.getDay()]);
    }
    const dailySales = last7Days.map((dayName) => {
      const found = dailyResults.find(
        (r) => dayNames[r._id.day - 1] === dayName
      );
      return { day: dayName, total: found ? found.total : 0 };
    });

    // Format monthly comparison: we assume two months: previous & current
    const monthlyComparison = monthlyResults.map((r) => ({
      month: new Date(r._id.year, r._id.month - 1).toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
      total: r.total,
    }));

    // Format yearly: something like [{ year: 2024, total: ... }, { year: 2025, total: ... }]
    const yearlySales = yearlyResults.map((r) => ({
      year: r._id.year,
      total: r.total,
      orders: r.orders,
    }));

    res.json({
      totalSales: totals.totalSales || 0,
      totalOrders: totals.totalOrders || 0,
      walkInOrders: totals.walkInOrders || 0,
      deliveryOrders: totals.deliveryOrders || 0,
      dailySales,
      monthlyComparison,
      yearlySales,
      topBuyers: topBuyersResults.map((b) => ({
        name: b._id,
        total: b.totalSpent,
      })),
    });
  } catch (err) {
    console.error("Failed to load dashboard:", err);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
});

router.get("/analytics/sales/daily", async (req, res) => {
  try {
    const daily = await Order.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          total: { $sum: "$price" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(daily);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch daily sales" });
  }
});

router.get("/analytics/sales/monthly", async (req, res) => {
  try {
    const monthly = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$price" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(monthly);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch monthly sales" });
  }
});

router.get("/analytics/sales/methods", async (req, res) => {
  try {
    const methods = await Order.aggregate([
      {
        $group: {
          _id: { $cond: [{ $eq: ["$delivery", true] }, "delivery", "walk-in"] },
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(methods);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sales methods" });
  }
});

router.get("/analytics/buyers/top", async (req, res) => {
  try {
    const topBuyers = await Order.aggregate([
      {
        $group: {
          _id: "$customerName",
          totalSpent: { $sum: "$price" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
    ]);
    res.json(topBuyers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch top buyers" });
  }
});

router.get("/analytics/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.get("/website-status", async (req, res) => {
  try {
    const status = await WebsiteStatus.findOne();
    res.json(status || { enabled: true, reason: "" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/website-status", async (req, res) => {
  try {
    const { enabled, reason } = req.body;

    let status = await WebsiteStatus.findOne();
    if (!status) {
      status = new WebsiteStatus({ enabled, reason });
    } else {
      status.enabled = enabled;
      status.reason = reason || "";
    }

    await status.save();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// Delete an order
router.delete("/orders/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Failed to delete order:", err);
    res.status(500).json({ message: "Failed to delete order" });
  }
});

module.exports = router;
