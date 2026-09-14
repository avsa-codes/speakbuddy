import { db } from "../prisma/db.js";

export const addRating = async (data: {
  reviewerId: string;
  reviewedUserId: string;
  rating: number;
}) => {
  const result = await db.transaction(async (tx) => {
    const user = await tx.orm.public.User.where({
      id: data.reviewedUserId,
    }).first();

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const createRating = await tx.orm.public.Rating.create({
      rating: data.rating,
      reviewerId: data.reviewerId,
      reviewedUserId: data.reviewedUserId,
    });

    const totalRatings = user.totalRatings ?? 0;
    const userRatings = user.rating ?? 0;

    const newTotalRatings = totalRatings + 1;

    const newAverage =
      (userRatings * totalRatings + data.rating) / newTotalRatings;

    const updatedUser = await tx.orm.public.User.where({
      id: data.reviewedUserId,
    }).update({
      rating: newAverage,
      totalRatings: newTotalRatings,
    });

    return {
      createRating,
      updatedUser,
    };
  });

  return result;
};
