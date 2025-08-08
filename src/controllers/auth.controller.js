import { db } from "../libs/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
        error: "User already exists",
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
      error,
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
        error: "Invalid user",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid user",
      });
    }

    // create token
    const token = jwt.sign(
      {
        id: user?.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    const cookieOption = {
      secure: false,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token",token,cookieOption);

    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: {
            userId: user?.id,
            email: user?.email,
            name: user?.name,
            image: user?.image,
        }
    })
  } catch (error) {
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error
    })
  }
};

const generateApiKey = async (req,res) => {

}

const profile = async (req,res) => {

}

export { register, login ,profile};
