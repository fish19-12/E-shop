import express from "express";
import multer from "multer";
import {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// ✅ CORRECT multer setup for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/add", upload.array("images", 10), addProduct);
router.delete("/:id", deleteProduct);

export default router;
