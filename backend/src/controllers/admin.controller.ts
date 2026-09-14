import type { NextFunction, Request, Response } from "express";
import { adminLoginToken } from "../services/admin.service";

export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const token = await adminLoginToken({
      email,
      password,
    });

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Admin login successful",
    });
  } catch (error) {
    next(error);
  }
};