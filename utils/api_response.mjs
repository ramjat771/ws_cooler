export const successResponse = (res, data, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message = "Error", status = 400,data=null) => {
  return res.status(status).json({
    success: false,
    message,
    data: data,
  });
};
