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
    // ✅ Redirect to deployed frontend login page on failure
    failureRedirect: "https://e-shop-zedt.vercel.app/login",
    session: false,
  }),
  (req, res) => {
    // Generate JWT for the logged-in user
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

    // ✅ Redirect to deployed frontend page with token
    res.redirect(`https://e-shop-zedt.vercel.app/google-login?token=${token}`);
  }
);

export default router;
