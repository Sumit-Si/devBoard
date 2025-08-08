import express from "express";
import { login, profile, register } from "../controllers/auth.controller.js";
import { userLoginValidator, userRegisterValidator } from "../validator/index.js";
import { validate } from "../middlewares/validate.middleware.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = express.Router();

// register route
router
    .route("/register")
    .post(userRegisterValidator(),validate,register)


// login route
router
    .route("/login")
    .post(userLoginValidator(),validate,login)

// profile route
router
    .route("/me")
    .post(isLoggedIn,profile)

export default router;