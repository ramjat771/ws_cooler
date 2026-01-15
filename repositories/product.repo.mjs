import Product from "../models/product.model.mjs";
import Counter from "../models/couter.model.mjs";

// --------------------------------------------------
// CREATE PRODUCT
// --------------------------------------------------
export const createProductRepo = async (data) => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: "productId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const product = new Product({
    ...data,
    productId: counter.seq,
  });

  return await product.save();
};

// --------------------------------------------------
export const getAllProductsRepo = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

export const getProductByIdRepo = async (id) => {
  return await Product.findOne({ productId: id });
};

// --------------------------------------------------
export const updateProductRepo = async (id, updateData) => {
  return await Product.findOneAndUpdate(
    { productId: id },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

// --------------------------------------------------
export const deleteProductRepo = async (id) => {
  return await Product.findOneAndDelete({ productId: id });
};
