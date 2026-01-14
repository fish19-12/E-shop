import express from "express";
import {
  createCategory,
  getCategories,
} from "../controllers/categoryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, admin, createCategory);

export default router;
