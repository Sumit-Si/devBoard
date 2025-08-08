import jwt from "jsonwebtoken"

const isLoggedIn = async (req, res) => {
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
    console.log(error,"auth middleware error");
    next(error);
  }
};


export {isLoggedIn}