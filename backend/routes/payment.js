import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Order from "../models/Order.js";

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
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "Processing",
    });

    await order.save();

    const io = req.app.get("io");
    io.emit("newOrder", {
      orderId: order._id,
      total: order.totalAmount,
    });

    // COD → finish
    if (paymentMethod === "COD") {
      return res.json({
        success: true,
        orderId: order._id,
        message: "Order placed (Cash on Delivery)",
      });
    }

    // Online payment → Chapa
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
        callback_url: "https://yourapi.com/api/payment/verify",
        return_url: "yourapp://payment-success",
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
    return res.status(500).json({ message: err.message });
  }
});

/**
 * ✅ ADD THIS — GET /api/payment/verify
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

    if (response.data.status === "success") {
      await Order.findOneAndUpdate(
        { tx_ref },
        { paymentStatus: "paid", orderStatus: "Confirmed" }
      );
    }

    res.send("Payment verified");
  } catch (error) {
    res.status(500).send("Verification failed");
  }
});

export default router;
