import express from "express";
import {
  generateApiKey,
  login,
  profile,
  register,
} from "../controllers/auth.controller.js";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../validator/index.js";
import { validate } from "../middlewares/validate.middleware.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// register route
router.route("/register").post(upload.single("image"),userRegisterValidator(), validate, register);

// login route
router.route("/login").post(userLoginValidator(), validate, login);

// apikey route
router.route("/api-key").post(isLoggedIn, generateApiKey);

// profile route
router.route("/me").get(isLoggedIn, profile);

export default router;
