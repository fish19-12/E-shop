import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// Get wishlist
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products"
    );
    if (!wishlist) return res.json([]);
    res.json(wishlist.products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [productId] });
    } else if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const populatedWishlist = await wishlist.populate("products");
    res.json(populatedWishlist.products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: userId });

    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (p) => p.toString() !== productId
      );
      await wishlist.save();
      const populatedWishlist = await wishlist.populate("products");
      res.json(populatedWishlist.products);
    } else {
      res.json([]);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
