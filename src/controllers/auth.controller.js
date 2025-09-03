import { db } from "../libs/db.js";
import { hashPassword, isPasswordCorrect } from "../utils/hash.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {generateAccessAndRefreshToken, generateKey} from "../utils/tokenGeneration.js"

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

    const hashedPassword = await hashPassword(password);

    let uploadResult;
    const localFilePath = req.file?.path;

    if (req.file && !localFilePath) {
      return res.status(400).json({
        message: "File is missing",
      });
    }

    try {
      if (localFilePath) uploadResult = await uploadOnCloudinary(localFilePath);

      // create new user
      const user = await db.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          image: uploadResult ? uploadResult?.url : null,
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
      return res.status(500).json({
        success: false,
        message: "Problem while creating user",
        error: error.message,
      });
    }
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
    const isMatch = await isPasswordCorrect(password,user);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid user",
      });
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(user);

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60 * 24,
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60 * 24 * 10,
      })
      .json({
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

    if (!user) {
      return res.status(400).json({
        message: "Invalid user",
      });
    }

    const key = generateKey();

    const apiKey = await db.ApiKey.create({
      data: {
        key,
        createdBy: user?.id,
      },
    });

    if (!apiKey) {
      return res.status(400).json({
        message: "Api key not generated",
      });
    }

    res.status(200).json({
      success: true,
      message: "Api key successfully created",
      key: apiKey?.key,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const profile = async (req, res) => {
  const userId = req.user?.id;

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
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { register, login, generateApiKey, profile };
