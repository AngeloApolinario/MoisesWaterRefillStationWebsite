const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {
    const { customerName, phone, address, hasContainer, delivery, user } =
      req.body;

    if (!user) return res.status(400).json({ message: "User ID is required" });

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

module.exports = router;
