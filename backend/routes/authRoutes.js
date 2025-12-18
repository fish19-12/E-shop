import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Normal auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// Google auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    // Generate JWT using your existing helper
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

    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/google-login?token=${token}`);
  }
);

export default router;
