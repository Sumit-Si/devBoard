import express from "express";
import {
  apiKeyAuth,
  isLoggedIn,
  collaboratorCheck,
} from "../middlewares/auth.middleware.js";
import {
  addCollaborator,
  getCollaborators,
  updateCollaborator,
  deleteCollaborator,
} from "../controllers/collaborator.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createCollaboratorValidator,
  updateCollaboratorValidator,
} from "../validator/index.js";

const router = express.Router({ mergeParams: true });
console.log(router,"router");

router
  .route("/")
  .get(
    isLoggedIn,
    apiKeyAuth,
    collaboratorCheck(["OWNER", "EDITOR", "VIEWER"]),
    getCollaborators,
  )
  .post(
    isLoggedIn,
    apiKeyAuth,
    collaboratorCheck(["OWNER"]),
    createCollaboratorValidator(),
    validate,
    addCollaborator,
  );

router
  .route("/:collaboratorId")
  .put(
    isLoggedIn,
    apiKeyAuth,
    collaboratorCheck(["OWNER"]),
    updateCollaboratorValidator(),
    validate,
    updateCollaborator,
  )
  .delete(
    isLoggedIn,
    apiKeyAuth,
    collaboratorCheck(["OWNER"]),
    deleteCollaborator,
  );

export default router;
