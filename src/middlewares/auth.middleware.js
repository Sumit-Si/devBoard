import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(400).json({
        error: "Unauthenticated - Token not exist",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

const apiKeyAuth = async (req, res, next) => {
  const key = req.header("Authorization")?.replace("Bearer ", "");

  if (!key) {
    return res.status(400).json({
      message: "Invalid key, generate a new one",
    });
  }

  try {
    const isKeyExist = await db.ApiKey.findUnique({
      where: {
        key,
      },
    });

    if (!isKeyExist) {
      return res.status(400).json({
        message: "Key not exist",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

const collaboratorCheck =
  (roles = []) =>
  async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const { projectId } = req.params;

      const isCollaborator = await db.collaborator.findFirst({
        where: {
          userId,
          projectId,
          deletedAt: null,
        },
      });

      if (!isCollaborator) {
        return res.status(404).json({
          message: "Collaborator data not exists",
        });
      }

      if (!roles?.includes(isCollaborator?.role)) {
        return res.status(403).json({
          message: "You are not authorized to create task in this project",
        });
      }
      return next();
    } catch (error) {
      next(error);
    }
  };

export { isLoggedIn, apiKeyAuth, collaboratorCheck };
