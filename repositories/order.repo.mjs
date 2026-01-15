import Order from "../models/order.model.mjs";
import Counter from "../models/couter.model.mjs";

// --------------------------------------------------
// CREATE ORDER
// --------------------------------------------------
export const createOrderRepo = async (data) => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: "orderId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const order = new Order({
    ...data,
    orderId: counter.seq,
  });

  return await order.save();
};

// --------------------------------------------------
export const getAllOrdersRepo = async () => {
  return await Order.find().sort({ createdAt: -1 });
};

// --------------------------------------------------
export const getOrderByIdRepo = async (id) => {
  return await Order.findOne({ orderId: id });
};

// ✅ NEW: GET ORDERS BY USER ID
export const getOrdersByUserIdRepo = async (userId) => {
  return await Order.find({ userId }).sort({ createdAt: -1 });
};

// --------------------------------------------------
export const updateOrderRepo = async (id, updateData) => {
  return await Order.findOneAndUpdate(
    { orderId: id },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

// --------------------------------------------------
export const deleteOrderRepo = async (id) => {
  return await Order.findOneAndDelete({ orderId: id });
};
