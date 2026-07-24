import prisma from "../utils/prisma.js";
import { verifyAuthToken } from "../utils/authToken.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to access this resource.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = verifyAuthToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "The account connected to this login no longer exists.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Your login has expired or is invalid. Please log in again.",
      });
    }

    next(error);
  }
};

export default protect;