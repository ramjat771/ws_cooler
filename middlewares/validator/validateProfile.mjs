import Joi from "joi";

const profileSchema = Joi.object({
    name:Joi.string(),
  email: Joi.string().email().lowercase().trim().required(),

  profileImage: Joi.string().uri().trim().optional().allow(""), // url
  dob: Joi.date().required(),

  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/) // 10–15 digit phone
    .required(),

  gender: Joi.string().valid("Male", "Female", "Other").required(),
  influencerMode: Joi.boolean().default(false), 

  serviceType: Joi.string().valid("Home", "Office", "Both").required(),

  serviceTime: Joi.string()
    .valid("1 Hour", "2 Hours", "Half Day", "Full Day")
    .required(),
});

export const validateProfile = (req, res, next) => {
  const { error, value } = profileSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((d) => d.message),
    });
  }
  req.body = value;
  next();
};
