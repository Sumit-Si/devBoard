import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6, max: 15 })
      .withMessage("Password must be at least 6 and max to 15 characters"),

    body("image").optional(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email")
      .trim(),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .trim()
      .isLength({ min: 6, max: 15 })
      .withMessage("Password must be at least 6 and max to 15 characters"),
  ];
};

export { userRegisterValidator,userLoginValidator };
