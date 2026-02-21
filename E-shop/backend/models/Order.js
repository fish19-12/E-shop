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

        title: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

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
      type: String,
      required: true,
    },

    /* ---------------- PAYMENT ---------------- */
    paymentMethod: {
      type: String,
      enum: [
        "COD",
        "ArifPay", // ✅ ADDED
        "Card",
        "telebirr",
        "cbe",
        "abyssinia",
        "chapa",
      ],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "unpaid", "paid", "failed"], // ✅ added failed
      default: "pending",
    },

    // ✅ For ArifPay / Chapa / future gateways
    tx_ref: {
      type: String,
    },

    // ✅ Store ArifPay session ID
    arifpaySessionId: {
      type: String,
    },

    // ✅ Store ArifPay transaction ID after success
    arifpayTransactionId: {
      type: String,
    },

    /* ---------------- ORDER STATUS ---------------- */
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
