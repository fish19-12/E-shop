import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";
import streamifier from "streamifier";

// Helper to upload a buffer to Cloudinary
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ADD PRODUCT
export const addProduct = async (req, res) => {
  try {
    console.log("FILES RECEIVED:", req.files);

    const { title, price, description, category, sizes, colors, isNew } =
      req.body;

    let imageUrls = [];

    // UPLOAD IMAGES TO CLOUDINARY
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const upload = await uploadFromBuffer(file.buffer);
        imageUrls.push(upload.secure_url);
      }
    } else {
      console.log("⚠️ No images received!");
    }

    // CREATE PRODUCT
    const product = await Product.create({
      title,
      price,
      description,
      category,
      sizes: JSON.parse(sizes || "[]"),
      colors: JSON.parse(colors || "[]"),
      isNew: isNew === "true" || isNew === true,
      images: imageUrls,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // DELETE IMAGE FROM CLOUDINARY
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        // Extract public ID more safely
        const parts = img.split("/").slice(-2); // ["products", "file.jpg"]
        const fileName = parts[1].split(".")[0];
        await cloudinary.uploader.destroy("products/" + fileName);
      }
    }

    await Product.findByIdAndDelete(productId);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
