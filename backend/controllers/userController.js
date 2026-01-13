import User from "../models/User.js";

/* =========================
   GET ALL USERS
========================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET SINGLE USER BY ID
========================= */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPDATE USER PROFILE
========================= */
export const updateUser = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, email } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to update profile" });
  }
};

/* =========================
   UPDATE USER PASSWORD
========================= */
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.password) {
      return res
        .status(400)
        .json({ message: "Password change not allowed for Google account" });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update password" });
  }
};

/* =========================
   SAVE PUSH TOKEN 🔔 (NEW)
========================= */
export const savePushToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Push token is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Avoid duplicates
    if (!user.expoPushTokens.includes(token)) {
      user.expoPushTokens.push(token);
      await user.save();
    }

    res.json({ message: "Push token saved successfully" });
  } catch (error) {
    console.log("Push token error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
