import type { NextFunction, Request, Response } from "express";
import { fetchAllTopics, fetchTopicById, postTopic, editTopic, removeTopicById} from "../services/topic.service";

export const getAllTopics = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const topics = await fetchAllTopics(); // service layer

    if (!topics) {
      res.status(404).json({
        success: false,
        message: "No Topics are available",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: topics,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopicById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {

    const topicId = req.params.id as string;
    const topic = await fetchTopicById(topicId); // service layer

    if (!topic) {
      res.status(404).json({
        success: false,
        message: "Topic is not available",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    next(error);
  }
};

export const createTopic = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {title, description} = req.body;

    if (!title || !description) {
      res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
      return;
    }
    
    const topic = await postTopic({title, description});

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

export const updateTopic = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const topicId = req.params.id as string;
    const { title, description } = req.body;

    if (!title && !description) {
      res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
      return;
    }

    const topic = await editTopic(topicId, { title, description });

    if (!topic) {
      res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTopic = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const topicId = req.params.id as string;

    const topic = await removeTopicById(topicId);

    if (!topic) {
      res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: topic,
    });
  } catch (error: any) {
    if (error.message === "TOPIC_IN_USE") {
      res.status(409).json({
        success: false,
        message: "Topic is currently in use and cannot be deleted.",
      });
      return;
    }

    next(error);
  }
};