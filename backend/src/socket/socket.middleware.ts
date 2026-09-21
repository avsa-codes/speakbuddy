import type { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { db } from "../prisma/db.js";

export const authenticateSocket = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((cookie) => cookie.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return next(new Error("Authentication required."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decoded as { userId: string }).userId;

    const user = await db.orm.public.User.where({ id: userId }).first();

    if (!user || user.isDeleted) {
      return next(new Error("User account is not active."));
    }

    socket.data.userId = userId;

    next();
  } catch {
    next(new Error("Invalid or expired token."));
  }
};
