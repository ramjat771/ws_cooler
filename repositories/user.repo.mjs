import User from "../models/user.model.mjs";
import Counter from "../models/couter.model.mjs";

// --------------------------------------------------
// CREATE USER
// --------------------------------------------------
export const createUserRepo = async (data) => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: "userId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const user = new User({
    ...data,
    userId: counter.seq,
    devices: data.devices || [],
  });

  return await user.save();
};

// --------------------------------------------------
export const getAllUsersRepo = async () => {
  return await User.find().sort({ createdAt: -1 });
};

export const getUserByEmailRepo = async (email) => {
  return await User.findOne({ email });
};

export const getUserByIdRepo = async (id) => {
  return await User.findOne({ userId: id });
};

// --------------------------------------------------
// UPDATE USER BASIC DATA
// --------------------------------------------------
export const updateUserRepo = async (id, updateData) => {
  return await User.findOneAndUpdate(
    { userId: id },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

// --------------------------------------------------
// 🔥 ADD DEVICE
// --------------------------------------------------
export const addDeviceRepo = async (id, device) => {
  return await User.findOneAndUpdate(
    { userId: id },
    { $addToSet: { devices: device } }, // duplicate nahi aayega
    { new: true }
  );
};

// --------------------------------------------------
// 🔥 REMOVE DEVICE
// --------------------------------------------------
export const removeDeviceRepo = async (id, device) => {
  return await User.findOneAndUpdate(
    { userId: id },
    { $pull: { devices: device } },
    { new: true }
  );
};

// --------------------------------------------------
export const deleteUserRepo = async (id) => {
  return await User.findOneAndDelete({ userId: id });
};
