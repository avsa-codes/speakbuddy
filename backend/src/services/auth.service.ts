import { db } from "../prisma/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    },
  );
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
};


export const verifyRefreshToken = (token: string) => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);

  return decoded as { userId: string };
};

export const userSignup = async (data: {
  email: string;
  name: string;
  username: string;
  password: string;
}) => {
  try {
    const user = await db.orm.public.User.create({
      name: data.name,
      email: data.email,
      username: data.username,
      password: data.password,
    });

    return user;
  } catch (error: any) {
    if (error.message.includes("email")) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    if (error.message.includes("username")) {
      throw new Error("USERNAME_ALREADY_EXISTS");
    }

    throw error;
  }
};


export const userLogin = async (data: { email: string; password: string }) => {
  const user = await db.orm.public.User.first({
    email: data.email,
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isEqual = await bcrypt.compare(data.password, user.password);

  if (!isEqual) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { accessToken, refreshToken };
};

export const getCurrentUser = async(userId : string) => {
   const user = await db.orm.public.User.where({ id: userId }).first();
   return user;
}
