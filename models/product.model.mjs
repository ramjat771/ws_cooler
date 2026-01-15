import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: { type: Number, unique: true },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    imageUrl: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0, // percentage
    },

    finalPrice: {
      type: Number,
    },

    stock: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🔥 AUTO CALCULATE FINAL PRICE
productSchema.pre("save", function (next) {
  this.finalPrice =
    this.price - (this.price * this.discount) / 100;
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
