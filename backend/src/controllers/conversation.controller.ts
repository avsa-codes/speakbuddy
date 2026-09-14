import type { NextFunction, Request, Response } from "express";
import { postConversation } from "../services/conversation.service";

export const createConversation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
      return;
    }

    const topic = await postConversation({ title, description });

    if (!topic) {
      res.status(404).json({
        success: false,
        message: "Topic not created",
      });
      return;
    }

    res.status(201).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    next(error);
  }
};
