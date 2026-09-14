import type { NextFunction, Request, Response } from "express";
import { addRating } from "../services/rating.service";
export const createRating = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const reviewerId = req.user?.userId;

    if (!reviewerId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const reviewedUserId = req.params.userId as string;
    const { rating } = req.body;

    const rateUser = await addRating({
      reviewerId,
      reviewedUserId,
      rating,
    });

    if (!rateUser.updatedUser) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    const { password: _, ...safeUser } = rateUser.updatedUser;

    res.status(201).json({
      success: true,
      data: {
        rating: rateUser.createRating,
        user: safeUser,
      },
    });
  } catch (error) {
    next(error);
  }
};