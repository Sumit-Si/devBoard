import express from "express";
import { apiKeyAuth, isLoggedIn } from "../middlewares/auth.middleware.js";
import { createProject, deleteProjectById, getProjectById, getProjects, updateProjectById } from "../controllers/project.controller.js";

const router = express.Router();

// create and get project route
router
    .route("/projects")
    .post(isLoggedIn,apiKeyAuth,createProject)
    .get(isLoggedIn,apiKeyAuth,getProjects)

// project by id route
router
    .route("/projects/:id")
    .get(isLoggedIn,apiKeyAuth,getProjectById)
    .put(isLoggedIn,apiKeyAuth,updateProjectById)
    .delete(isLoggedIn,apiKeyAuth,deleteProjectById)

export default router;