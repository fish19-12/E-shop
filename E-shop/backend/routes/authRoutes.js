import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// --------------------- Normal auth ---------------------
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 Forgot password (NEW)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// --------------------- Google auth ---------------------
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://e-shop-zedt.vercel.app/login",
    session: false,
  }),
  (req, res) => {
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

    res.redirect(`https://e-shop-zedt.vercel.app/shop?token=${token}`);
  }
);

export default router;
