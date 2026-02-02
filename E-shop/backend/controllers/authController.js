import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// ================= JWT =================
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      isAdmin: isAdmin || false,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= FORGOT PASSWORD (MOBILE ONLY) =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 🔐 Hash token before saving
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    // 📱 Expo deep link (mobile)
    const resetLink = `${process.env.MOBILE_APP_URL}?token=${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset</h2>
        <p>You requested a password reset for your Fisho Fashion account.</p>

        <a href="${resetLink}"
           style="display:inline-block;margin-top:16px;padding:12px 20px;
           background:#ff2d55;color:#fff;border-radius:8px;
           text-decoration:none;font-weight:bold;">
          Reset Password
        </a>

        <p style="margin-top:20px;font-size:14px;color:#555;">
          This link expires in 15 minutes.
        </p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: "Reset your Fisho Fashion password",
      html,
    });

    res.json({ message: "Reset link sent to email" });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Failed to send reset email" });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and password are required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
