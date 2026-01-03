import express from "express";
import multer from "multer";
import {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// ✅ Multer setup for memory storage (for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ============================
// PRODUCT ROUTES
// ============================

// GET all products
router.get("/", getAllProducts);

// GET a single product by ID
router.get("/:id", getProductById);

// POST add a new product (with image upload)
router.post("/add", upload.array("images", 10), addProduct);

// DELETE a product by ID
router.delete("/:id", deleteProduct);

export default router;
