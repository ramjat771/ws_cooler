import * as userService from "../services/user.service.mjs";
import { errorResponse, successResponse } from "../utils/api_response.mjs";

export const createUserController = async (req, res, next) => {
  try {
    const result = await userService.createUser(req.body);

    if (result.login === true) {
      return successResponse(res, result.user, "Login successful");
    }

    if (result.login === false && !result.created) {
      return errorResponse(res, "Invalid password",401 ,null);
    }

    if (result.created === true) {
      return successResponse(res, result.user, "User created successfully");
    }

  } catch (err) {
    next(err);
  }
};

export const getAllUsersController = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return successResponse(res, users, "Users fetched successfully");
  } catch (err) {
    next(err);
  }
};
export const getUserByEmailController = async (req, res, next) => {
  try {
    const user = await userService.getUserByEmail(req.params.email);
    if (!user) return successResponse(res, null, "User not found", 404);

    return successResponse(res, user, "User fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const getUserByIdController = async (req, res, next) => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    if (!user) return successResponse(res, null, "User not found", 404);
    return successResponse(res, user, "User fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const updateUserController = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(
      Number(req.params.id),
      req.body
    );
    if (!updatedUser) return successResponse(res, null, "User not found", 404);
    return successResponse(res, updatedUser, "User updated successfully");
  } catch (err) {
    next(err);
  }
};

export const deleteUserController = async (req, res, next) => {
  try {
    const deletedUser = await userService.deleteUser(Number(req.params.id));
    if (!deletedUser) return successResponse(res, null, "User not found", 404);
    return successResponse(res, null, "User deleted successfully");
  } catch (err) {
    next(err);
  }
};
