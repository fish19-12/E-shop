import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

// GET /wishlist/:userId => get all wishlist items for a user
router.get("/:userId", getWishlist);

// POST /wishlist => add product to wishlist
router.post("/", addToWishlist);

// DELETE /wishlist/:userId/:productId => remove product from wishlist
router.delete("/:userId/:productId", removeFromWishlist);

export default router;
