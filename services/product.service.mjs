import * as productRepo from "../repositories/product.repo.mjs";
import { CustomError } from "../utils/custom_error.mjs";

// --------------------------------------------------
export const createProduct = async (data) => {
  if (!data?.name || !data?.price) {
    throw new CustomError("Product name and price required", 400);
  }

  return await productRepo.createProductRepo(data);
};

// --------------------------------------------------
export const getAllProducts = async () => {
  return await productRepo.getAllProductsRepo();
};

export const getProductById = async (id) => {
  return await productRepo.getProductByIdRepo(id);
};

export const updateProduct = async (id, data) => {
  return await productRepo.updateProductRepo(id, data);
};

export const deleteProduct = async (id) => {
  return await productRepo.deleteProductRepo(id);
};
