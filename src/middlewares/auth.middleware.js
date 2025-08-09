import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(400).json({
        error: "Unauthenticated - Token not exist",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error, "auth middleware error");
    next(error);
  }
};

const apiKeyAuth = async (req, res, next) => {
  const key = req.header("Authorization").replace("Bearer ", "");
  console.log(key, "key");

  if (!key) {
    return res.status(400).json({
      message: "Invalid key, generate a new one",
    });
  }

  try {
    const isKeyExist = await db.ApiKeys.findUnique({
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

export { isLoggedIn, apiKeyAuth };
