import * as userService from "../services/user.service.mjs";
import { errorResponse, successResponse } from "../utils/api_response.mjs";
import { CustomError } from "../utils/custom_error.mjs";

// --------------------------------------------------
export const createUserController = async (req, res, next) => {
  try {
    // 🔥 SAFE ACCESS
    if (!req.body) {
      throw new CustomError("Request body is missing", 400);
    }

    const { email, username, mobile, password } = req.body;

    if (!email || !username || !mobile || !password) {
      throw new CustomError(
        "email, username, mobile and password are required",
        400
      );
    }

    const result = await userService.createOrGetUser(req.body);

    if (result.exists) {
      return successResponse(res, result.user, "User already exists");
    }

    return successResponse(res, result.user, "User created successfully");

  } catch (err) {
    next(err);
  }
};

// --------------------------------------------------
export const addDeviceController = async (req, res, next) => {
  try {
    const { device } = req.body;

    if (!device) {
      return errorResponse(res, "Device required", 400);
    }

    const user = await userService.addDevice(
      Number(req.params.id),
      device
    );
    return successResponse(res, user, "Device added successfully");
  } catch (err) {
    next(err);
  }
};

// --------------------------------------------------
export const removeDeviceController = async (req, res, next) => {
  try {
    const { device } = req.body;

    const user = await userService.removeDevice(
      Number(req.params.id),
      device
    );

    return successResponse(res, user, "Device removed successfully");
  } catch (err) {
    next(err);
  }
};
