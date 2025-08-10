import express from "express";
import { apiKeyAuth, isLoggedIn } from "../middlewares/auth.middleware.js";
import { createTask, getTasks } from "../controllers/task.controller.js";

const router = express.Router();

// create task
router
    .route("/projects/:projectId/tasks")
    .post(isLoggedIn,apiKeyAuth,createTask)
    .get(isLoggedIn,apiKeyAuth,getTasks);

export default router;
