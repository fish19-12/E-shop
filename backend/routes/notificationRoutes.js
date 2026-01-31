 import express from "express";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get user notifications
router.get("/", protect, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(notifications);
});

// Mark as read
router.put("/:id/read", protect, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});

// Delete a notification ✅
router.delete("/:id", protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Make sure the user owns this notification
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await notification.remove();
    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a notification
router.post("/", protect, async (req, res) => {
  try {
    const { title, message, type, link } = req.body;

    if (!title || !message || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const notification = await Notification.create({
      user: req.user._id,
      title,
      message,
      type,
      link: link || "",
    });

    const io = req.app.get("io");
    if (io) {
      io.to(req.user._id.toString()).emit("new-notification", notification);
    }

    res.status(201).json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
