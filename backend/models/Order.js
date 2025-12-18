import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          min: 1,
        },
        color: { type: String },
        size: { type: String },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Card"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "unpaid", "paid"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
  },
  { timestamps: true }
);

// 🚫 FIX: Prevent OverwriteModelError (important in Next.js / Node hot reload)
export default mongoose.models.Order || mongoose.model("Order", orderSchema);
