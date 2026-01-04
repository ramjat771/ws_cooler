import Joi from "joi";

const schema = Joi.object({
  categoryName: Joi.string().trim().min(2).required(),
  categoryCode: Joi.string(),
  imgUrl: Joi.string().uri().trim().optional().allow(""),
  photo: Joi.string().trim().optional().allow(""), // base64 ya url
  description: Joi.string().trim().optional().allow(""),
});

export const validateCategory = (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map(d => d.message),
    });
  }
  req.body = value;
  next();
};
