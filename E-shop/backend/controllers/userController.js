import User from "../models/User.js";

/* =========================
   GET ALL USERS
========================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error.message);
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
    console.error("GET USER ERROR:", error.message);
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
    console.error("UPDATE USER ERROR:", error.message);
    res.status(400).json({ message: "Failed to update profile" });
  }
};

/* =========================
   DELETE USER (ADMIN)
========================= */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE USER ERROR:", error.message);
    res.status(500).json({ message: "Failed to delete user" });
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
      return res.status(400).json({
        message: "Password change not allowed for Google account",
      });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("UPDATE PASSWORD ERROR:", error.message);
    res.status(500).json({ message: "Failed to update password" });
  }
};

/* =========================
   SAVE PUSH TOKEN 🔔
========================= */
export const savePushToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(400).json({ message: "Push token is required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Avoid duplicates
    if (!user.expoPushTokens.includes(token)) {
      user.expoPushTokens.push(token);
      try {
        await user.save();
        res.json({ message: "Push token saved successfully" });
      } catch (saveError) {
        console.warn("Failed to save push token:", saveError.message);
        res.status(500).json({ message: "Failed to save push token" });
      }
    } else {
      res.json({ message: "Push token already exists" });
    }
  } catch (error) {
    console.error("SAVE PUSH TOKEN ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
