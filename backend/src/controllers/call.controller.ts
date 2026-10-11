import type { NextFunction, Request, Response } from "express";
import { generateAgoraToken } from "../services/agora.service";
import { db } from "../prisma/db";

export const getAgoraToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const uid = await db.orm.public.User.where({ id: userId }).first();

    if (!uid) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

const conversationId = String(req.query.conversationId ?? "");

if (!conversationId) {
  res.status(400).json({
    success: false,
    message: "Conversation ID is required.",
  });
  return;
}



    const conversation = await db.orm.public.Conversation.where({
      id: conversationId,
    }).first();

    if (
      !conversation ||
      (conversation.user1Id !== userId && conversation.user2Id !== userId)
    ) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to join this conversation.",
      });
      return;
    }

    if (conversation.status !== "ACTIVE") {
      res.status(400).json({
        success: false,
        message: "Calls are only allowed for active conversations.",
      });
      return;
    }

    const channelName = `conversation_${conversation.id}`;
    
    const token = generateAgoraToken(channelName, uid.agoraUid);

    res.status(200).json({
      success: true,
      data: {
        appId: process.env.AGORA_APP_ID,
        channelName,
        uid: uid.agoraUid,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
