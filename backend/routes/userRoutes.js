import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  updatePassword,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all users
router.get("/", protect, getAllUsers);

// GET single user
router.get("/:id", protect, getUserById);

// UPDATE profile
router.put("/:id", protect, updateUser);

// UPDATE password (SECURED)
router.put("/:id/password", protect, updatePassword);

export default router;
