import { logError } from "../utils/logger.mjs";
import { CustomError } from "../utils/custom_error.mjs";

export const errorHandler = (err, req, res, next) => {
  // Log error always
  logError(err);

  // 1️⃣ Handle CustomError
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: err.data,
    });
  }

  // 2️⃣ Handle Mongoose Validation Errors (very important)
  if (err.name === "ValidationError") {
    const formattedErrors = {};

    for (const key in err.errors) {
      formattedErrors[key] = err.errors[key].message;
    }

    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: formattedErrors,
    });
  }

  // 3️⃣ Handle duplicate key errors (optional)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // 4️⃣ Any other error → internal server error
  console.error("❌ Unexpected Error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
