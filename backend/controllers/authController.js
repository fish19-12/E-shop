 import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// ---------------- REGISTER ----------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

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
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- LOGIN ----------------
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
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= FORGOT PASSWORD (MOBILE + WEB) =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token for storage
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    // Deep link for mobile
    const mobileLink = `fisho://reset-password?token=${resetToken}`;
    // Web link for desktop
    const webLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send email with both options
    const htmlContent = `
      <h2>Password Reset</h2>
      <p>You requested a password reset.</p>

      <!-- Mobile deep link -->
      <p>If you are on mobile, tap the button below:</p>
      <a href="${mobileLink}" style="padding:12px 20px;background:#ff2d55;color:#fff;border-radius:8px;text-decoration:none;">
        Reset Password (Mobile)
      </a>

      <!-- Web link fallback -->
      <p>Or open this link in your browser:</p>
      <a href="${webLink}" style="padding:12px 20px;background:#007bff;color:#fff;border-radius:8px;text-decoration:none;">
        Reset Password (Web)
      </a>

      <p>This link expires in 15 minutes.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: "Reset your Fisho Fashion password",
      html: htmlContent,
    });

    res.json({ message: "Reset link sent to email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
