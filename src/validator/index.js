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
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be at least 8 and max to 20 characters"),

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

// project validation
const createProjectValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Project Name is required")
      .isLength({ min: 3, max: 50 })
      .withMessage("Project Name must be 3-50 characters"),

    body("description")
      .optional()
      .trim()
      .isLength({ min: 20, max: 1200 })
      .withMessage("Description must be 20-1200 characters"),
  ];
};

const updateProjectValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Project Name is required")
      .isLength({ min: 3, max: 50 })
      .withMessage("Project Name must be 3-50 characters"),

    body("description")
      .optional()
      .trim()
      .isLength({ min: 20, max: 1200 })
      .withMessage("Description must be 20-1200 characters"),
  ];
};

// task validation
const createTaskValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3, max: 50 })
      .withMessage("Title must be 3-50 characters"),

    body("description")
      .trim()
      .optional()
      .isLength({ min: 10, max: 500 })
      .withMessage("must be 10-500 characters"),

    body("assignedTo").trim().notEmpty().withMessage("AssignedTo is required"),

    body("assignedBy").trim().notEmpty().withMessage("AssignedBy is required"),

    body("status")
      .trim()
      .optional()
      .isIn(["DONE", "INPROGRESS", "TODO"])
      .withMessage("Status should either be TODO,INPROGRESS or DONE"),

    body("priority")
      .trim()
      .optional()
      .isIn(["EASY", "MEDIUM", "HARD"])
      .withMessage("Priority should either be EASY,MEDIUM or HARD"),
  ];
};

const updateTaskValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3, max: 50 })
      .withMessage("Title must be 3-50 characters"),

    body("description")
      .trim()
      .optional()
      .isLength({ min: 10, max: 500 })
      .withMessage("must be 10-500 characters"),

    body("status")
      .trim()
      .optional()
      .isIn(["DONE", "INPROGRESS", "TODO"])
      .withMessage("Status should either be TODO,INPROGRESS or DONE"),

    body("priority")
      .trim()
      .optional()
      .isIn(["EASY", "MEDIUM", "HARD"])
      .withMessage("Priority should either be EASY,MEDIUM or HARD"),
  ];
};

// collaborator validation
const createCollaboratorValidator = () => {
  return [
    body("userId").trim().notEmpty().withMessage("userId is required"),
    body("role")
      .trim()
      .notEmpty()
      .withMessage("role is required")
      .isIn(["VIEWER", "EDITOR", "OWNER"])
      .withMessage("role must be VIEWER, EDITOR, or OWNER"),
  ];
};

const updateCollaboratorValidator = () => {
  return [
    body("role")
      .trim()
      .notEmpty()
      .withMessage("role is required")
      .isIn(["VIEWER", "EDITOR", "OWNER"])
      .withMessage("role must be VIEWER, EDITOR, or OWNER"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  createProjectValidator,
  updateProjectValidator,
  createTaskValidator,
  updateTaskValidator,
  createCollaboratorValidator,
  updateCollaboratorValidator,
};
