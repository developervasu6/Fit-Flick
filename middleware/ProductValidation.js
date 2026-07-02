import joi from "joi";

export const productValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().trim().min(2).max(100).required(),

    price: joi.number().min(0).required(),

    size: joi
      .array()
      .items(joi.string().valid("xs", "s", "m", "l", "xl", "xxl"))
      .min(1)
      .required(),

    category: joi.string().required(),

    description: joi.string().trim().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    const message = error?.details[0]?.message || "Invalid product data";

    return res.status(400).json({
      message,
      error,
    });
  }

  next();
};
