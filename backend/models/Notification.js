import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["order", "payment", "wishlist"],
      required: true,
    },
    isRead: { type: Boolean, default: false },
    link: { type: String }, // e.g. /orders/123
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
