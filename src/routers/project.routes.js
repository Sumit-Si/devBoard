import express from "express";
import { apiKeyAuth, isLoggedIn } from "../middlewares/auth.middleware.js";
import { createProject } from "../controllers/project.controller.js";

const router = express.Router();

// create project route
router
    .route("/projects")
    .post(isLoggedIn,apiKeyAuth,createProject)


export default router;