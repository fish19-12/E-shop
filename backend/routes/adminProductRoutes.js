import express from "express";
import multer from "multer";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
} from "../controllers/productController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET ALL PRODUCTS (Admin)
router.get("/", protect, admin, getAllProducts);

// ADD PRODUCT
router.post("/add", protect, admin, upload.array("images"), addProduct);

// DELETE PRODUCT
router.delete("/:id", protect, admin, deleteProduct);

export default router;
