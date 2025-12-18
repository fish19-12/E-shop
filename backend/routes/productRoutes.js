import express from "express";
import multer from "multer";
import {
  addProduct,
  getAllProducts,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/add", upload.array("images"), addProduct); // "images" = frontend key

export default router;
