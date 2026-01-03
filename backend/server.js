import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import passport from "passport";
import morgan from "morgan"; // optional logging

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminMetricsRoute from "./routes/adminMetricsRoute.js";
import paymentRoutes from "./routes/payment.js";
import "./config/passportGoogle.js";

import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Wishlist
import wishlistRoutes from "./routes/wishlistRouter.js"; // ✅ new wishlist routes

import { errorHandler } from "./middleware/errorMiddleware.js";

import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
connectDB();

const app = express();

// ---- Middleware ----
app.use(
  cors({
    origin: "*", // adjust to your frontend domain in production
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(morgan("dev")); // logs requests in dev
app.use(express.json({ limit: "50mb" })); // allow large JSON payloads
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // allow large form data

// ---- Passport ----
app.use(passport.initialize());

// ---- Routes ----
// Auth
app.use("/api/auth", authRoutes);

// Users
app.use("/api/users", userRoutes);

// Public Product Routes
app.use("/api/products", productRoutes);

// Admin Product Routes
app.use("/api/admin/products", adminProductRoutes);

// Admin dashboard metrics
app.use("/api/admin/metrics", adminMetricsRoute);

// Payment
app.use("/api/payment", paymentRoutes);

// Orders
app.use("/api/orders", orderRoutes);

// Categories
app.use("/api/categories", categoryRoutes);

// ===== Wishlist =====
app.use("/api/wishlist", wishlistRoutes); // ✅ mount wishlist routes

// ---- Error Handler ----
app.use(errorHandler);

// ---- Root ----
app.get("/", (req, res) => res.send("E-Commerce API Running"));

// ---- Socket.IO Setup ----
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // adjust to your frontend domain in production
    methods: ["GET", "POST"],
  },
});

// Make io accessible in routes/controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected via Socket.IO:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ---- Start Server ----
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
