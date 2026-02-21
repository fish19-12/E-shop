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
      },
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

    const { title, price, description, category, sizes, colors, isNew, stock } =
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
      }),
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
      stock: Number(stock) || 0, // ✅ added stock
      images: imageUrls,
      imagePublicIds: publicIds,
    });
    // ============================
    // 🔔 SEND PUSH NOTIFICATIONS
    // ============================
    const users = await User.find({
      expoPushTokens: { $exists: true, $ne: [] },
    });

    const messages = users.flatMap((user) =>
      user.expoPushTokens.map((token) => ({
        to: token,
        sound: "default",
        title: "🛍 New Product Added!",
        body: `${product.title} is now available in ${product.category}`,
        data: { productId: product._id },
      })),
    );

    if (messages.length > 0) {
      try {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messages),
        });
      } catch (notifyError) {
        console.warn("Push notification failed:", notifyError.message);
      }
    }

    res.status(201).json(product);
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error.message);
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
    console.error("GET ALL PRODUCTS ERROR:", error.message);
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
    console.error("GET PRODUCT ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const {
      title,
      price,
      description,
      category,
      sizes,
      colors,
      isNew,
      stock,
      existingImages,
    } = req.body;

    // 1️⃣ Update basic fields
    product.title = title ?? product.title;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.category = validCategories.includes(category)
      ? category
      : product.category;
    product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
    product.colors = colors ? JSON.parse(colors) : product.colors;
    product.isNew = isNew === "true" || isNew === true;
    product.stock = Number(stock) ?? product.stock;

    // 2️⃣ Handle existing images (sent from frontend)
    let existingImgs = [];
    if (existingImages) {
      existingImgs = JSON.parse(existingImages); // array of URLs
    }

    // 3️⃣ Handle new uploaded images
    let uploadedImages = [];
    let uploadedPublicIds = [];
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) => uploadFromBuffer(file.buffer)),
      );
      uploadedImages = uploads.map((u) => u.secure_url);
      uploadedPublicIds = uploads.map((u) => u.public_id);
    }

    // 4️⃣ Delete old images that were removed
    const removedImages = product.imagePublicIds?.filter(
      (_, idx) => !existingImgs.includes(product.images[idx]),
    );
    if (removedImages && removedImages.length > 0) {
      await Promise.all(
        removedImages.map((id) =>
          cloudinary.uploader.destroy(id).catch((err) => console.warn(err)),
        ),
      );
    }

    // 5️⃣ Combine images and public IDs
    product.images = [...existingImgs, ...uploadedImages];
    product.imagePublicIds = [
      ...product.imagePublicIds.filter((id, idx) =>
        existingImgs.includes(product.images[idx]),
      ),
      ...uploadedPublicIds,
    ];

    await product.save();

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error.message);
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
          cloudinary.uploader
            .destroy(publicId)
            .catch((err) =>
              console.warn(`Failed to delete image ${publicId}:`, err.message),
            ),
        ),
      );
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};
