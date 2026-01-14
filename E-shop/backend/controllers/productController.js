import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import streamifier from "streamifier";
import fetch from "node-fetch"; // npm i node-fetch@2

const validCategories = ["New Arrivals", "Women", "Men", "Shoes", "Kids"];

// Helper: upload buffer to Cloudinary
const uploadFromBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// ============================
// ADD PRODUCT + SEND PUSH NOTIFICATIONS
// ============================
export const addProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const { title, price, description, category, sizes, colors, isNew } =
      req.body;

    // Validate category
    const finalCategory = validCategories.includes(category)
      ? category
      : "New Arrivals";

    // Upload images to Cloudinary
    const uploads = await Promise.all(
      req.files.map((file) => {
        if (!file.buffer)
          throw new Error(`File ${file.originalname} missing buffer`);
        return uploadFromBuffer(file.buffer);
      })
    );

    const imageUrls = uploads.map((u) => u.secure_url);
    const publicIds = uploads.map((u) => u.public_id);

    // Create product
    const product = await Product.create({
      title,
      price,
      description,
      category: finalCategory,
      sizes: sizes ? JSON.parse(sizes) : [],
      colors: colors ? JSON.parse(colors) : [],
      isNew: isNew === "true" || isNew === true,
      images: imageUrls,
      imagePublicIds: publicIds,
    });

    // ============================
    // 🔔 SEND PUSH NOTIFICATIONS
    // ============================

    // Get all users who have Expo tokens
    const users = await User.find({
      expoPushTokens: { $exists: true, $ne: [] },
    });

    // Create Expo push messages
    const messages = users.flatMap((user) =>
      user.expoPushTokens.map((token) => ({
        to: token,
        sound: "default",
        title: "🛍 New Product Added!",
        body: `${product.title} is now available in ${product.category}`,
        data: { productId: product._id },
      }))
    );

    // Send notifications to Expo
    if (messages.length > 0) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      });
    }

    res.status(201).json(product);
  } catch (error) {
    console.error("🔥 ADD PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ============================
// GET ALL PRODUCTS
// ============================
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("GET ALL PRODUCTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ============================
// GET PRODUCT BY ID
// ============================
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ============================
// DELETE PRODUCT
// ============================
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete images from Cloudinary
    if (product.imagePublicIds?.length) {
      await Promise.all(
        product.imagePublicIds.map((publicId) =>
          cloudinary.uploader.destroy(publicId)
        )
      );
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
