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

    const userIdParam = req.params.userId;

    if (typeof userIdParam !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
      return;
    }

    const reviewedUserId = userIdParam;
    const { rating } = req.body;

    // Validate the rating before accessing the database.
    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5.",
      });
      return;
    }

    if (reviewerId === reviewedUserId) {
      res.status(400).json({
        success: false,
        message: "You cannot rate yourself.",
      });
      return;
    }

    const result = await addRating({
      reviewerId,
      reviewedUserId,
      rating,
    });

    if ("error" in result && result.error === "USER_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

   if (!result.updatedUser) {
     res.status(500).json({
       success: false,
       message: "Failed to update user rating.",
     });
     return;
   }

   const safeUser = result.updatedUser;

    res.status(201).json({
      success: true,
      data: {
        rating: result.createRating,
        user: safeUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
