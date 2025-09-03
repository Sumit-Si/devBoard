import express from "express";
import { apiKeyAuth, isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  createProject,
  deleteProjectById,
  getProjectById,
  getProjects,
  updateProjectById,
} from "../controllers/project.controller.js";
import { createProjectValidator, updateProjectValidator } from "../validator/index.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

// create and get project route
router
  .route("/")
  .post(
    isLoggedIn,
    apiKeyAuth,
    createProjectValidator(),
    validate,
    createProject,
  )
  .get(isLoggedIn, apiKeyAuth, getProjects);

// project by id route
router
  .route("/:id")
  .get(isLoggedIn, apiKeyAuth, getProjectById)
  .put(isLoggedIn, apiKeyAuth,updateProjectValidator(),validate, updateProjectById)
  .delete(isLoggedIn, apiKeyAuth, deleteProjectById);

export default router;
