import joi from "joi";

export const signupValidation = (req, res, next) => {
  const schema = joi.object({
    firstname: joi.string().trim().min(2).required(),
    lastname: joi.string().trim().min(2).required(),
    email: joi.string().trim().email().required(),
    password: joi.string().min(6).max(60).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    const message = error?.details[0]?.message || "Fields are not valid";
    return res.status(400).json({ message, error });
  }

  next();
};
