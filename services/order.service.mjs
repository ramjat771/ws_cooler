import * as orderRepo from "../repositories/order.repo.mjs";
import { CustomError } from "../utils/custom_error.mjs";

// --------------------------------------------------
export const createOrder = async (data) => {
  if (
    !data?.userId ||
    !data?.productId ||
    !data?.mobileNumber ||
    !data?.address ||
    !data?.price
  ) {
    throw new CustomError("Required order fields missing", 400);
  }

  return await orderRepo.createOrderRepo(data);
};

// --------------------------------------------------
export const getAllOrders = async () => {
  return await orderRepo.getAllOrdersRepo();
};

export const getOrderById = async (id) => {
  return await orderRepo.getOrderByIdRepo(id);
};

// ✅ NEW
export const getOrdersByUserId = async (userId) => {
  if (!userId) {
    throw new CustomError("UserId is required", 400);
  }
  return await orderRepo.getOrdersByUserIdRepo(userId);
};

export const updateOrder = async (id, data) => {
  return await orderRepo.updateOrderRepo(id, data);
};

export const deleteOrder = async (id) => {
  return await orderRepo.deleteOrderRepo(id);
};
