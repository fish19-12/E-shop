import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  updatePassword,
} from "../controllers/userController.js";

const router = express.Router();

// GET all users
router.get("/", getAllUsers);

// GET single user
router.get("/:id", getUserById);

// UPDATE profile
router.put("/:id", updateUser);

// UPDATE password
router.put("/:id/password", updatePassword);

export default router;
