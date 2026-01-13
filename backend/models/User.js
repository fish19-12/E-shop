import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isAdmin: { type: Boolean, default: false },
    googleId: { type: String },

    // 🔔 PUSH NOTIFICATION TOKENS
    expoPushTokens: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Only hash password if it exists
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (password) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
