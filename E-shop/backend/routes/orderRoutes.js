import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// Create order
router.post("/", createOrder);

// Get all orders (admin)
router.get("/", getAllOrders);

// Get orders of one user (must come BEFORE /:id)
router.get("/user/:userId", getUserOrders);

// Get a single order
router.get("/:id", getOrderById);

// Update order status
router.put("/:id/status", updateOrderStatus);

// Delete order
router.delete("/:id", deleteOrder);

export default router;
