import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// --------------------- Normal auth ---------------------
router.post("/register", registerUser);
router.post("/login", loginUser);

// --------------------- Google auth ---------------------
// Start Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    // Redirect to your deployed frontend login page if login fails
    failureRedirect: "https://e-shop-zedt.vercel.app/login",
    session: false, // no session, we use JWT
  }),
  (req, res) => {
    // Generate JWT for the logged-in Google user
    const token = jwt.sign(
      {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        isAdmin: req.user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // ✅ Redirect straight to Shop page with token
    res.redirect(`https://e-shop-zedt.vercel.app/shop?token=${token}`);
  }
);

export default router;
