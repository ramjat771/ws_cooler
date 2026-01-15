import * as productService from "../services/product.service.mjs";
import { successResponse, errorResponse } from "../utils/api_response.mjs";
import { CustomError } from "../utils/custom_error.mjs";

// --------------------------------------------------
export const createProductController = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new CustomError("Request body missing", 400);
    }

    const product = await productService.createProduct(req.body);
    return successResponse(res, product, "Product created successfully");
  } catch (err) {
    next(err);
  }
};

// --------------------------------------------------
export const getAllProductsController = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    return successResponse(res, products, "Products fetched");
  } catch (err) {
    next(err);
  }
};

// --------------------------------------------------
export const getProductByIdController = async (req, res, next) => {
  try {
    const product = await productService.getProductById(
      Number(req.params.id)
    );

    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }

    return successResponse(res, product, "Product fetched");
  } catch (err) {
    next(err);
  }
};

// --------------------------------------------------
export const updateProductController = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(
      Number(req.params.id),
      req.body
    );

    return successResponse(res, product, "Product updated");
  } catch (err) {
    next(err);
  }
};

// --------------------------------------------------
export const deleteProductController = async (req, res, next) => {
  try {
    const product = await productService.deleteProduct(
      Number(req.params.id)
    );

    return successResponse(res, product, "Product deleted");
  } catch (err) {
    next(err);
  }
};
