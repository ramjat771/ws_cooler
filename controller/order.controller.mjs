import * as orderService from "../services/order.service.mjs";
import { successResponse, errorResponse } from "../utils/api_response.mjs";
import { CustomError } from "../utils/custom_error.mjs";

// --------------------------------------------------
export const createOrderController = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new CustomError("Request body missing", 400);
    }

    const order = await orderService.createOrder(req.body);
    return successResponse(res, order, "Order placed successfully");
  } catch (err) {
    next(err);
  }
};

// --------------------------------------------------
export const getAllOrdersController = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    return successResponse(res, orders, "Orders fetched");
  } catch (err) {
    next(err);
  }
};

// --------------------------------------------------
export const getOrderByIdController = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
      Number(req.params.id)
    );

    if (!order) {
      return errorResponse(res, "Order not found", 404);
    }

    return successResponse(res, order, "Order fetched");
  } catch (err) {
    next(err);
  }
};

// ✅ NEW: GET ORDERS BY USER ID
export const getOrdersByUserIdController = async (req, res, next) => {
  try {
    const orders = await orderService.getOrdersByUserId(
      req.params.userId
    );

    return successResponse(res, orders, "User orders fetched");
  } catch (err) {
    next(err);
  }
};

// --------------------------------------------------
export const updateOrderController = async (req, res, next) => {
  try {
    const order = await orderService.updateOrder(
      Number(req.params.id),
      req.body
    );

    return successResponse(res, order, "Order updated");
  } catch (err) {
    next(err);
  }
};

// --------------------------------------------------
export const deleteOrderController = async (req, res, next) => {
  try {
    const order = await orderService.deleteOrder(
      Number(req.params.id)
    );

    return successResponse(res, order, "Order deleted");
  } catch (err) {
    next(err);
  }
};
