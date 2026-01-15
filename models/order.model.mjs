import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: Number,
      unique: true,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },

    productId: {
      type: Number,
      required: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      default: 0.0,
    },

    longitude: {
      type: Number,
      default: 0.0,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    totalAmount: {
      type: Number,
    },

    orderStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "DELIVERED"],
      default: "PENDING",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🔥 AUTO CALCULATE TOTAL
orderSchema.pre("save", function (next) {
  this.totalAmount = this.price * this.quantity;
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
