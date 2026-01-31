 import express from "express";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all user notifications
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Mark a notification as read
router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a notification
router.delete("/:id", protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await notification.remove();
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete notification:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a notification (with duplicate check for orders)
router.post("/", protect, async (req, res) => {
  try {
    const { title, message, type, link, orderId } = req.body;

    if (!title || !message || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Prevent duplicate order notifications
    if (type === "order" && orderId) {
      const existing = await Notification.findOne({
        user: req.user._id,
        type: "order",
        orderId: orderId,
      });
      if (existing) {
        return res.status(200).json(existing); // return existing notification
      }
    }

    const notification = await Notification.create({
      user: req.user._id,
      title,
      message,
      type,
      link: link || "",
      orderId: orderId || null,
    });

    // Emit real-time socket event
    const io = req.app.get("io"); // make sure you attached io to app
    if (io) {
      io.to(req.user._id.toString()).emit("new-notification", notification);
    }

    res.status(201).json(notification);
  } catch (err) {
    console.error("Failed to create notification:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
