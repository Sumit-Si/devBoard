import express from "express";
import { apiKeyAuth, isLoggedIn } from "../middlewares/auth.middleware.js";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/task.controller.js";
import {createTaskValidator, updateTaskValidator} from "../validator/index.js";
import {validate} from "../middlewares/validate.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// create task
router
    .route("/projects/:projectId/tasks")
    .post(isLoggedIn,apiKeyAuth,upload.array("attachments",3),createTaskValidator(),validate,createTask)
    .get(isLoggedIn,apiKeyAuth,getTasks);

// update and delete task route
router
    .route("/tasks/:id")
    .put(isLoggedIn,apiKeyAuth,updateTaskValidator(),validate, updateTask)
    .delete(isLoggedIn,apiKeyAuth,deleteTask)

export default router;
