import { db } from "../prisma/db.js";
import type { NextFunction, Request, Response } from "express";
import {
  createGroupDiscussion,
  getUpcomingGroupDiscussions,
  reserveGroupDiscussion,
  cancelGroupDiscussionReservation,
  getUserGroupDiscussionReservation,
  startGroupDiscussion,
  endGroupDiscussion,
  enterGroupDiscussionWaitingRoom,
  joinGroupDiscussion,
} from "../services/groupDiscussion.service.js";
import type { Server } from "socket.io";

export const createGroupDiscussionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { topicId, maxParticipants, scheduledStartAt } = req.body;

    const groupDiscussion = await createGroupDiscussion({
      topicId,
      maxParticipants,
      scheduledStartAt,
    });

    res.status(201).json({
      success: true,
      message: "Group discussion created successfully.",
      data: groupDiscussion,
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingGroupDiscussionsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const discussions = await getUpcomingGroupDiscussions();

    res.status(200).json({
      success: true,
      data: discussions,
    });
  } catch (error) {
    next(error);
  }
};

export const reserveGroupDiscussionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const groupDiscussionId = req.params.id as string;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const reservation = await reserveGroupDiscussion(groupDiscussionId, userId);

    res.status(201).json({
      success: true,
      message: "Group discussion reserved successfully.",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelGroupDiscussionReservationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const groupDiscussionId = req.params.id as string;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const reservation = await cancelGroupDiscussionReservation(
      groupDiscussionId,
      userId,
    );

    res.status(200).json({
      success: true,
      message: "Group discussion reservation cancelled successfully.",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserGroupDiscussionReservationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const groupDiscussionId = req.params.id as string;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const reservation = await getUserGroupDiscussionReservation(
      groupDiscussionId,
      userId,
    );

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

//Factory Function: Give me the dependencies this controller needs, and I'll create the actual Express controller.

export const createStartGroupDiscussionController = (io: Server) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const groupDiscussionId = req.params.id as string;

      const discussion = await startGroupDiscussion(groupDiscussionId);

      const reservations = await db.orm.public.GroupReservation.where({
        groupDiscussionId,
        status: "RESERVED",
      }).all();

      for (const reservation of reservations) {
        io.to(`user:${reservation.userId}`).emit("group:started", {
          groupDiscussionId,
        });
      }

      res.status(200).json({
        success: true,
        message: "Group discussion started successfully.",
        data: discussion,
      });
    } catch (error) {
      next(error);
    }
  };
};

export const createEndGroupDiscussionController = (io: Server) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const groupDiscussionId = req.params.id as string;

      const discussion = await endGroupDiscussion(groupDiscussionId);

      const participants = await db.orm.public.GroupParticipant.where({
        groupDiscussionId,
      }).all();

      for (const participant of participants) {
        io.to(`user:${participant.userId}`).emit("group:ended", {
          groupDiscussionId,
        });
      }

      res.status(200).json({
        success: true,
        message: "Group discussion ended successfully.",
        data: discussion,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const enterGroupDiscussionWaitingRoomController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const groupDiscussionId = req.params.id as string;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const discussion = await enterGroupDiscussionWaitingRoom(
      groupDiscussionId,
      userId,
    );

    res.status(200).json({
      success: true,
      message: "You can enter the waiting room.",
      data: discussion,
    });
  } catch (error) {
    next(error);
  }
};

export const joinGroupDiscussionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const groupDiscussionId = req.params.id as string;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const participant = await joinGroupDiscussion(groupDiscussionId, userId);

    res.status(200).json({
      success: true,
      message: "Joined group discussion successfully.",
      data: participant,
    });
  } catch (error) {
    next(error);
  }
};
