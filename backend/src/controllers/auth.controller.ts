import { db } from "../prisma/db.js";
import bcrypt from "bcryptjs";
import { getProfilePhotoUrl } from "../services/s3.service.js";
import type { NextFunction, Request, Response } from "express";
import {
  userSignup,
  userLogin,
  generateToken,
  getCurrentUser,
  generateRefreshToken,
  verifyRefreshToken
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
const refreshToken = generateRefreshToken(user.id);

res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 1000,
});

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
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

    const { accessToken, refreshToken } = await userLogin({
      email,
      password,
    });

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
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

let profilePhotoUrl: string | null = null;

if (user.profilePhoto) {
  profilePhotoUrl = await getProfilePhotoUrl(user.profilePhoto);
}

res.status(200).json({
  success: true,
  data: {
    ...safeUser,
    profilePhotoUrl,
  },
});
  } catch (error) {
    next(error);
  }
};


export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: "Refresh token required.",
      });
      return;
    }

    const { userId } = verifyRefreshToken(refreshToken);

    const user = await db.orm.public.User.where({
      id: userId,
    }).first();

    if (!user || user.isDeleted) {
      res.status(401).json({
        success: false,
        message: "User account is not active.",
      });
      return;
    }

    const accessToken = generateToken(userId);

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Access token refreshed.",
    });
  } catch (error) {
    if (
      (error instanceof Error && error.name === "JsonWebTokenError") ||
      (error instanceof Error && error.name === "TokenExpiredError")
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token.",
      });
      return;
    }

    next(error);
  }
};
