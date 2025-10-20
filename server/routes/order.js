const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {
    const { customerName, phone, address, hasContainer, delivery, user } =
      req.body;

    if (!user) return res.status(400).json({ message: "Use3r ID is required" });

    let price = 0;
    if (!hasContainer) price = 200;
    else price = delivery ? 30 : 25;

    const newOrder = new Order({
      customerName,
      phone,
      address: delivery ? address : "",
      hasContainer,
      delivery,
      price,
      user,
      status: "Pending",
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order successfully created!", order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  const userId = req.query.userId;

  if (!userId) return res.status(400).json({ message: "User ID required" });

  try {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "On the Way", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
