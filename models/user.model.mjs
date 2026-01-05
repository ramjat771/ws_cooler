import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: Number, unique: true },

    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    mobile: { type: String, required: true, trim: true },
    password: { type: String, required: true },

    // 🔥 NEW FIELD
    devices: {
      type: [String],   // array of strings
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
