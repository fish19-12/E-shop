import express from "express";
import { v4 as uuidv4 } from "uuid";
import ArifpayPackage from "arifpay";
import Order from "../models/Order.js";
import Notification from "../models/Notification.js";

const router = express.Router();

/**
 * 🔥 FIX FOR NODE 22 + ESM
 * Supports both:
 * - export default class Arifpay
 * - module.exports = Arifpay
 */
const Arifpay = ArifpayPackage?.default || ArifpayPackage;

/**
 * 🔥 INIT ARIFPAY
 */
if (!process.env.ARIFPAY_API_KEY || !process.env.ARIFPAY_MERCHANT_ID) {
  console.error("❌ Missing ARIFPAY environment variables");
}

const arifpay = new Arifpay({
  apiKey: process.env.ARIFPAY_API_KEY,
  merchantId: process.env.ARIFPAY_MERCHANT_ID,
  environment: "production", // change to "sandbox" if testing
});

/**
 * =====================================================
 * POST /api/payment/init
 * =====================================================
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
      shippingAddress: shipping,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "Processing",
    });

    await order.save();

    const io = req.app.get("io");

    // 🔔 Notify order placed
    await Notification.create({
      user: order.user,
      title: "Order placed",
      message: `Your order #${order._id} was placed successfully.`,
      type: "order",
      link: `/orders/${order._id}`,
    });

    if (io) {
      io.to(order.user.toString()).emit("new-notification");
      io.emit("newOrder", {
        orderId: order._id,
        total: order.totalAmount,
      });
    }

    // ================= CASH ON DELIVERY =================
    if (paymentMethod === "COD") {
      return res.json({
        success: true,
        orderId: order._id,
        message: "Order placed (Cash on Delivery)",
      });
    }

    // ================= ARIFPAY ONLINE =================
    const nonce = "order-" + uuidv4();

    const session = await arifpay.checkout.create({
      cancelUrl: "https://e-shop-u4nv.onrender.com/payment/cancel",
      successUrl: "https://e-shop-u4nv.onrender.com/api/payment/success",
      errorUrl: "https://e-shop-u4nv.onrender.com/payment/error",
      notifyUrl: "https://e-shop-u4nv.onrender.com/api/payment/webhook",

      phone: shipping.phone,
      email: shipping.email || "customer@fisho.com",
      nonce,

      paymentMethods: ["TELEBIRR", "CARD"],

      items: [
        {
          name: "Order Payment",
          quantity: 1,
          price: total,
        },
      ],
    });

    order.tx_ref = nonce;
    order.arifSessionId = session.sessionId;
    await order.save();

    return res.json({
      success: true,
      orderId: order._id,
      paymentUrl: session.paymentUrl,
    });
  } catch (err) {
    console.error("Payment init error:", err);
    return res.status(500).json({ message: err.message });
  }
});

/**
 * =====================================================
 * 🔔 ARIFPAY WEBHOOK (REAL PAYMENT CONFIRMATION)
 * POST /api/payment/webhook
 * =====================================================
 */
router.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    console.log("ArifPay Webhook:", data);

    const order = await Order.findOne({ tx_ref: data.nonce });
    if (!order) return res.sendStatus(404);

    const io = req.app.get("io");

    if (data.status === "SUCCESS") {
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
      order.paymentStatus = "failed";
      await order.save();
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    res.sendStatus(500);
  }
});

/**
 * =====================================================
 * ✅ SUCCESS REDIRECT (for Expo testing)
 * =====================================================
 */
router.get("/success", (req, res) => {
  res.redirect("exp://127.0.0.1:8081/--/checkout/success");
});

export default router;
