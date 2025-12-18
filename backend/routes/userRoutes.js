import express from "express";
import { getAllUsers, getUserById } from "../controllers/userController.js";

const router = express.Router();

// GET all customers
router.get("/", getAllUsers);

// GET single customer by ID
router.get("/:id", getUserById);

export default router;
