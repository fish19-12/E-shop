import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";
import streamifier from "streamifier";

// Helper: upload buffer to Cloudinary
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

// ✅ ADD PRODUCT
export const addProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log(
      "FILES:",
      req.files?.map((f) => ({
        name: f.originalname,
        hasBuffer: !!f.buffer,
        size: f.size,
      }))
    );

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const { title, price, description, category, sizes, colors, isNew } =
      req.body;

    // Upload all images in parallel
    const uploads = await Promise.all(
      req.files.map((file) => {
        if (!file.buffer) {
          throw new Error(`File ${file.originalname} missing buffer`);
        }
        return uploadFromBuffer(file.buffer);
      })
    );

    const imageUrls = uploads.map((u) => u.secure_url);
    const publicIds = uploads.map((u) => u.public_id);

    const product = await Product.create({
      title,
      price,
      description,
      category,
      sizes: sizes ? JSON.parse(sizes) : [],
      colors: colors ? JSON.parse(colors) : [],
      isNew: isNew === "true" || isNew === true,
      images: imageUrls,
      imagePublicIds: publicIds, // for safe deletion
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("🔥 ADD PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete images from Cloudinary using stored publicIds
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
