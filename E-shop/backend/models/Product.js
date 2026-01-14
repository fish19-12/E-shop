import mongoose from "mongoose";

const validCategories = ["New Arrivals", "Women", "Men", "Shoes", "Kids"];

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: validCategories, // ensures only valid categories
      default: "New Arrivals",
    },
    images: [{ type: String }], // URLs of product images
    imagePublicIds: [{ type: String }], // Cloudinary public IDs for deletion
    isNew: { type: Boolean, default: false },
    sizes: [{ type: String }], // available sizes
    colors: [{ type: String }], // available colors
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
