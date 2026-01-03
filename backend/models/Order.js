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
        color: String,
        size: String,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    /* ✅ SHIPPING (EXTENDED, NOT BROKEN) */
    shippingAddress: {
      // Web app (existing)
      fullName: { type: String },

      // Mobile app (new)
      firstName: { type: String },
      lastName: { type: String },

      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      region: { type: String },
    },

    /* ✅ DELIVERY */
    deliveryMethod: {
      type: String,
      enum: ["addis", "region", "pickup"],
      default: "addis",
    },

    deliveryFee: {
      type: Number,
      default: 0,
    },

    /* ✅ PAYMENT */
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

    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
  },
  { timestamps: true }
);

// Prevent model overwrite
export default mongoose.models.Order || mongoose.model("Order", orderSchema);
