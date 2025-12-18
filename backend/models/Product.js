import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    images: [{ type: String }],
    isNew: { type: Boolean, default: false },
    sizes: [{ type: String }],
    colors: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
