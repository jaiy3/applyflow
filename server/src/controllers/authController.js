import bcrypt from "bcryptjs";

import prisma from "../utils/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";
import { createAuthToken } from "../utils/authToken.js";

const publicUserFields = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.validated.body;

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "An account with this email address already exists.",
    });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      passwordHash,
    },
    select: publicUserFields,
  });

  const token = createAuthToken(user.id);

  res.status(201).json({
    success: true,
    message: "Your ApplyFlow account was created successfully.",
    token,
    user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;

  const normalizedEmail = email.trim().toLowerCase();

  const userWithPassword = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!userWithPassword) {
    return res.status(401).json({
      success: false,
      message: "The email address or password is incorrect.",
    });
  }

  const passwordIsCorrect = await bcrypt.compare(
    password,
    userWithPassword.passwordHash
  );

  if (!passwordIsCorrect) {
    return res.status(401).json({
      success: false,
      message: "The email address or password is incorrect.",
    });
  }

  const token = createAuthToken(userWithPassword.id);

  const user = {
    id: userWithPassword.id,
    firstName: userWithPassword.firstName,
    lastName: userWithPassword.lastName,
    email: userWithPassword.email,
    createdAt: userWithPassword.createdAt,
    updatedAt: userWithPassword.updatedAt,
  };

  res.status(200).json({
    success: true,
    message: "You have logged in successfully.",
    token,
    user,
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "You have logged out successfully.",
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});