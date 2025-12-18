import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// POST /api/payment/init
router.post("/init", async (req, res) => {
  const { items, total, shipping, userId } = req.body;

  if (!items || !total || !shipping || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const order = new Order({
      user: userId,
      items: items.map((item) => ({
        product: item.product,
        qty: item.qty,
        color: item.color,
        size: item.size,
      })),
      totalAmount: total,
      shippingAddress: shipping,
      paymentMethod: "COD",
      paymentStatus: "pending",
      orderStatus: "Processing",
    });

    await order.save();

    // Grab io from app instance
    const io = req.app.get("io");

    // Emit event to all connected admin clients
    io.emit("newOrder", {
      orderId: order._id,
      user: order.user,
      total: order.totalAmount,
    });

    return res.json({
      success: true,
      message: "Order placed successfully (Cash on Delivery)",
      orderId: order._id,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Payment initiation failed", error: err.message });
  }
});

export default router;
