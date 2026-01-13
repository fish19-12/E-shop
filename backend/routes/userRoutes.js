import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  updatePassword,
  savePushToken, // 🔔 NEW
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all users
router.get("/", protect, getAllUsers);

// GET single user
router.get("/:id", protect, getUserById);

// UPDATE profile
router.put("/:id", protect, updateUser);

// UPDATE password
router.put("/:id/password", protect, updatePassword);

// 🔔 SAVE PUSH TOKEN
router.post("/push-token", protect, savePushToken);

export default router;
