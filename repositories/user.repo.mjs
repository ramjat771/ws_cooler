import User from "../models/user.model.mjs";
import Counter from "../models/couter.model.mjs";

export const createUserRepo = async (data) => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: "userId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const user = new User({
    ...data,
    userId: counter.seq,
  });

  return await user.save();
};

export const getAllUsersRepo = async () => {
  return await User.find().sort({ createdAt: -1 });
};
export const getUserByEmailRepo = async (email) => {
  return await User.findOne({ email });
};


export const getUserByIdRepo = async (id) => {
  return await User.findOne({ userId: id });
};

export const updateUserRepo = async (id, updateData) => {
  return await User.findOneAndUpdate(
    { userId: id },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const deleteUserRepo = async (id) => {
  return await User.findOneAndDelete({ userId: id });
};
