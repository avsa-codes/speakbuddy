import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const adminToken = req.cookies.adminToken;

  if (!adminToken) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET!);

    const isAdmin = (decoded as { isAdmin: boolean }).isAdmin;

    if (!isAdmin) {
      res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
      return;
    }

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired admin token.",
    });
    return;
  }
};
