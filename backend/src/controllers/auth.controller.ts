import bcrypt from "bcryptjs";
import type { NextFunction, Request, Response } from "express";
import {
  userSignup,
  userLogin,
  generateToken,
  getCurrentUser,
} from "../services/auth.service.js";
import { validationResult } from "express-validator";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }

    const { email, name, username, password } = req.body;

    const hashedPW = await bcrypt.hash(password, 12);

    const user = await userSignup({
      name,
      email,
      username,
      password: hashedPW,
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User could not be created.",
      });
      return;
    }

    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = user;

    res.status(201).json({
      success: true,
      data: safeUser,
    });
  } catch (error: any) {
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
      return;
    }

    if (error.message === "USERNAME_ALREADY_EXISTS") {
      res.status(409).json({
        success: false,
        message: "Username already exists.",
      });
      return;
    }

    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const token = await userLogin({
      email,
      password,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await getCurrentUser(userId!);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    const { password: _, ...safeUser } = user;

    res.status(200).json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};
