// routes/adminMetricsRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";

// have models: Product, Order, User, import them here
// import Product from "../models/productModel.js";
// import Order from "../models/orderModel.js";
// import User from "../models/userModel.js";

const router = express.Router();

// GET admin dashboard metrics
router.get("/", protect, admin, async (req, res) => {
  try {
    // Temporary static metrics for testing
    const metrics = {
      totalSales: 400,
      totalOrders: 120,
      totalProducts: 50,
      totalCustomers: 80,
      newArrivals: 5,
    };

    // Later, you can calculate real metrics from database
    // Example:
    // const totalProducts = await Product.countDocuments();
    // const totalOrders = await Order.countDocuments();
    // const totalSales = await Order.aggregate([...]);
    // const totalCustomers = await User.countDocuments();

    res.json(metrics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
