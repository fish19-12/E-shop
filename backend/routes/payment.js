import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Order from "../models/Order.js";
import Notification from "../models/Notification.js"; // 🔔 NEW

const router = express.Router();

/**
 * POST /api/payment/init
 */
router.post("/init", async (req, res) => {
  const { items, total, shipping, userId, paymentMethod } = req.body;

  if (!items || !total || !shipping || !userId || !paymentMethod) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // ================= CREATE ORDER =================
    const order = new Order({
      user: userId,

      items: items.map((item) => ({
        product: item.product,
        title: item.title,
        price: item.price,
        image: item.image,
        qty: item.qty,
        color: item.color || "",
        size: item.size || "",
      })),

      totalAmount: total,

      shippingAddress: {
        fullName: shipping.fullName,
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        region: shipping.region,
      },

      deliveryMethod: shipping.deliveryMethod || "addis",
      deliveryFee: shipping.deliveryFee || 0,
      expectedDelivery: shipping.expectedDelivery || "2–3 Days",

      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "Processing",
    });

    await order.save();

    // 🔔 Notification for order creation
    await Notification.create({
      user: order.user,
      title: "Order placed",
      message: `Your order #${order._id} was placed successfully.`,
      type: "order",
      link: `/orders/${order._id}`,
    });

    // 🔔 Emit Socket.IO event
    const io = req.app.get("io");
    if (io) {
      io.to(order.user.toString()).emit("new-notification");
      io.emit("newOrder", {
        orderId: order._id,
        total: order.totalAmount,
      });
    }

    // ================= CASH ON DELIVERY =================
    if (paymentMethod === "COD") {
      await Notification.create({
        user: order.user,
        title: "Payment pending (COD) 💵",
        message: `Your order #${order._id} is awaiting Cash on Delivery.`,
        type: "payment",
        link: `/orders/${order._id}`,
      });

      return res.json({
        success: true,
        orderId: order._id,
        message: "Order placed (Cash on Delivery)",
      });
    }

    // ================= CHAPA ONLINE PAYMENT =================
    const tx_ref = "tx-" + uuidv4();

    const chapaRes = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: total,
        currency: "ETB",
        email: shipping.email || "customer@fisho.com",
        first_name: shipping.firstName,
        last_name: shipping.lastName,
        phone_number: shipping.phone,
        tx_ref,
        callback_url: "https://e-shop-u4nv.onrender.com/api/payment/verify",
        return_url: "https://e-shop-u4nv.onrender.com/api/payment/success",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    order.tx_ref = tx_ref;
    await order.save();

    return res.json({
      success: true,
      orderId: order._id,
      paymentUrl: chapaRes.data.data.checkout_url,
    });
  } catch (err) {
    console.error("Payment init error:", err);
    return res.status(500).json({ message: err.message });
  }
});

/**
 * ✅ VERIFY PAYMENT (CHAPA CALLBACK)
 * GET /api/payment/verify
 */
router.get("/verify", async (req, res) => {
  const { tx_ref } = req.query;

  try {
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const order = await Order.findOne({ tx_ref });
    if (!order) {
      return res.status(404).send("Order not found");
    }

    const io = req.app.get("io");

    if (response.data.status === "success") {
      order.paymentStatus = "paid";
      order.orderStatus = "Confirmed";
      await order.save();

      await Notification.create({
        user: order.user,
        title: "Payment successful 💳",
        message: `Payment for order #${order._id} was successful.`,
        type: "payment",
        link: `/orders/${order._id}`,
      });

      if (io) io.to(order.user.toString()).emit("new-notification");
    } else {
      await Notification.create({
        user: order.user,
        title: "Payment failed ❌",
        message: `Payment for order #${order._id} failed. Please try again.`,
        type: "payment",
        link: `/orders/${order._id}`,
      });

      if (io) io.to(order.user.toString()).emit("new-notification");
    }

    res.send("Payment verified");
  } catch (error) {
    console.error("Verify error:", error.message);
    res.status(500).send("Verification failed");
  }
});

/**
 * ✅ SUCCESS REDIRECT
 */
router.get("/success", (req, res) => {
  res.redirect("exp://127.0.0.1:8081/--/checkout/success");
});

export default router;
