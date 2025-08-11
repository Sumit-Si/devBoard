import express from "express";
import { apiKeyAuth, isLoggedIn } from "../middlewares/auth.middleware.js";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/task.controller.js";

const router = express.Router();

// create task
router
    .route("/projects/:projectId/tasks")
    .post(isLoggedIn,apiKeyAuth,createTask)
    .get(isLoggedIn,apiKeyAuth,getTasks);

// update and delete task route
router
    .route("/tasks/:id")
    .put(isLoggedIn,apiKeyAuth, updateTask)
    .delete(isLoggedIn,apiKeyAuth,deleteTask)

export default router;
