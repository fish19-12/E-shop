import mongoose from "mongoose";

const validCategories = ["New Arrivals", "Women", "Men", "Shoes", "Kids"];

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },

    category: {
      type: String,
      enum: validCategories,
      default: "New Arrivals",
    },

    images: [{ type: String }],
    imagePublicIds: [{ type: String }],

    isNew: { type: Boolean, default: false },

    sizes: [{ type: String }],
    colors: [{ type: String }],

    // ✅ NEW FIELD
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0, // prevents negative stock
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
