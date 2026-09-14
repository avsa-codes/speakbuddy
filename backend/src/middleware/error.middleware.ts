import type { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};
