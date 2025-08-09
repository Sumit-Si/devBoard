import { db } from "../libs/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    // #TODO: ...(image && {image}) inside the data
    console.log(user, "newUser");

    res.status(200).json({
      success: true,
      message: "User created successfully",
      user: {
        userId: user?.id,
        name: user?.name,
        email: user?.email,
        image: user?.image,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid user",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid user",
      });
    }

    // create token
    const token = jwt.sign(
      {
        id: user?.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const cookieOption = {
      secure: false,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOption);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        userId: user?.id,
        email: user?.email,
        name: user?.name,
        image: user?.image,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const generateApiKey = async (req, res) => {
  const userId = req.user?.id;
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if(!user) {
      return res.status(400).json({
        message: "Invalid user",
      })
    }

    console.log(user,"user");
    
    
    const key = crypto.randomBytes(32).toString("hex");
    console.log(key,"key");

    const apiKey = await db.ApiKeys.create({
      data: {
        key,
        createdBy: user?.id,
      }
    })

    if(!apiKey) {
      return res.status(400).json({
        message: "Api key not generated"
      })
    }

    res.status(200).json({
      success: true,
      message: "Api key successfully created",
      key: apiKey?.key,
    })
  } catch (error) {
    console.log("Error",error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
};

const profile = async (req, res) => {
  const userId = req.user?.id;
  console.log(userId, "userId");

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid user",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: {
        userId: user?.id,
        name: user?.name,
        email: user?.email,
        image: user?.image,
      },
    });
  } catch (error) {
    console.log(error, "catchError");

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { register, login, generateApiKey, profile };
