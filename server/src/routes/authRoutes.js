import express from "express";
import { z } from "zod";

import {
  getCurrentUser,
  login,
  logout,
  register,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must contain at least 2 characters.")
      .max(50, "First name cannot exceed 50 characters."),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must contain at least 2 characters.")
      .max(50, "Last name cannot exceed 50 characters."),

    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(254, "Email address is too long."),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters.")
      .max(72, "Password cannot exceed 72 characters.")
      .regex(/[a-z]/, "Password must contain a lowercase letter.")
      .regex(/[A-Z]/, "Password must contain an uppercase letter.")
      .regex(/[0-9]/, "Password must contain a number."),
  }),

  params: z.object({}),
  query: z.object({}),
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Enter a valid email address."),

    password: z
      .string()
      .min(1, "Password is required."),
  }),

  params: z.object({}),
  query: z.object({}),
});

router.post(
  "/register",
  validateRequest(registerSchema),
  register
);

router.post(
  "/login",
  validateRequest(loginSchema),
  login
);

router.post("/logout", logout);

router.get("/me", protect, getCurrentUser);

export default router;