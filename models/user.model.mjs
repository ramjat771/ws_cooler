import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: Number, unique: true },  // Auto Increment ID
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    mobile: { type: String, required: true, trim: true },
    password: { type: String, required: true }, // No encryption
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
