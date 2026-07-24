import express from "express";

import prisma from "../utils/prisma.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ApplyFlow API is running",
    timestamp: new Date().toISOString(),
  });
});

router.get("/database", async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "ApplyFlow database is connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;