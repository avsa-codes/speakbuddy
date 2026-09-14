import { db } from "../prisma/db";

type LanguageProficiency =
  | "BEGINNER"
  | "ELEMENTARY"
  | "INTERMEDIATE"
  | "UPPER_INTERMEDIATE"
  | "ADVANCED"
  | "PROFICIENT";

export const fetchUserProfile = async (userId: string) => {
  // Prisma 8 uses separate chained methods for filtering properties
  const user = await db.orm.public.User.where({ id: userId }).first();

  return user;
};

export const fetchOwnProfile = async (userId: string) => {

  const user = await db.orm.public.User.where({ id: userId }).first();

  return user;
};

export const editProfile = async (
  userId: string,
  data: {
    name?: string;
    username?: string;
    bio?: string;
    interests?: string[];
    languageProficiency?: LanguageProficiency;
  },
) => {
  const updateData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );

  return await db.orm.public.User.where({ id: userId }).update(updateData);
};

export const removeProfile = async (userId: string) => {
  
    const user = await db.orm.public.User.where({ id: userId }).update({
      isDeleted: true,
    });

    return user;
  
};