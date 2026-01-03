import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    /* ---------------- USER ---------------- */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ---------------- ORDER ITEMS ---------------- */
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        // ✅ Snapshot fields (DO NOT CHANGE AFTER ORDER)
        title: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        // ✅ SELECTED IMAGE (VERY IMPORTANT)
        image: {
          type: String,
          required: true,
        },

        qty: {
          type: Number,
          required: true,
          min: 1,
        },

        color: {
          type: String,
          default: "",
        },

        size: {
          type: String,
          default: "",
        },
      },
    ],

    /* ---------------- TOTAL ---------------- */
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    /* ---------------- SHIPPING ---------------- */
    shippingAddress: {
      fullName: { type: String, required: true },
      firstName: { type: String },
      lastName: { type: String },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      region: { type: String },
    },

    /* ---------------- DELIVERY ---------------- */
    deliveryMethod: {
      type: String,
      enum: ["addis", "region", "pickup"],
      default: "addis",
    },

    deliveryFee: {
      type: Number,
      default: 0,
    },

    expectedDelivery: {
      type: String, // "1 Day", "3 Days", "Same Day Pickup"
      required: true,
    },

    /* ---------------- PAYMENT ---------------- */
    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "telebirr", "cbe", "abyssinia", "chapa"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "unpaid", "paid"],
      default: "pending",
    },

    /* ---------------- ORDER STATUS ---------------- */
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
  },
  { timestamps: true }
);

// Prevent model overwrite (Next.js / hot reload safe)
export default mongoose.models.Order || mongoose.model("Order", orderSchema);
