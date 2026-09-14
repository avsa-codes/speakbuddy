import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../prisma/db.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decoded as { userId: string }).userId;

    const user = await db.orm.public.User.where({ id: userId }).first();

    if (!user || user.isDeleted) {
      res.status(401).json({
        success: false,
        message: "User account is not active.",
      });
      return;
    }

    req.user = { userId };
    next();

  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
    return;
  }

}