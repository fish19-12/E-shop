import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import User from "../models/User.js";

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --------------------- Normal auth ---------------------
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 Forgot password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ======================================================
// 🌐 GOOGLE AUTH (WEB – PASSPORT / REDIRECT)
// ======================================================
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
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
      { expiresIn: "30d" },
    );

    res.redirect(`https://e-shop-zedt.vercel.app/shop?token=${token}`);
  },
);

// ======================================================
// 📱 GOOGLE AUTH (MOBILE – EXPO / TOKEN BASED)
// ======================================================
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Google token missing" });
    }

    // Verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: sub,
        provider: "google",
      });
    }

    // Create your app JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    res.json({ token, user });
  } catch (error) {
    console.error("Google mobile auth error:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

export default router;
