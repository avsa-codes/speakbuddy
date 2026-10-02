import { Router } from "express";
import type { Server } from "socket.io";

import {
  createGroupDiscussionController,
  getUpcomingGroupDiscussionsController,
  reserveGroupDiscussionController,
  cancelGroupDiscussionReservationController,
  getUserGroupDiscussionReservationController,
  createStartGroupDiscussionController,
  createEndGroupDiscussionController,
  enterGroupDiscussionWaitingRoomController,
  joinGroupDiscussionController,
  getAllGroupDiscussionsForAdminController,
  getGroupDiscussionByIdController
} from "../controllers/groupDiscussion.controller.js";

import { authenticateAdmin } from "../middleware/adminAuth.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

export const createGroupDiscussionRouter = (io: Server) => {
  const router = Router();

  router.post("/", authenticateAdmin, createGroupDiscussionController);

  router.get("/", authenticate, getUpcomingGroupDiscussionsController);

  router.post("/:id/reserve", authenticate, reserveGroupDiscussionController);

  router.post(
    "/:id/cancel",
    authenticate,
    cancelGroupDiscussionReservationController,
  );

  router.get(
    "/:id/reservation",
    authenticate,
    getUserGroupDiscussionReservationController,
  );

  router.post(
    "/:id/start",
    authenticateAdmin,
    createStartGroupDiscussionController(io),
  );

  router.post("/:id/end", authenticateAdmin, createEndGroupDiscussionController(io));

  router.get(
    "/:id/waiting-room",
    authenticate,
    enterGroupDiscussionWaitingRoomController,
  );

  router.post("/:id/join", authenticate, joinGroupDiscussionController);

  router.get(
    "/admin",
    authenticateAdmin,
    getAllGroupDiscussionsForAdminController,
  );

  router.get("/:id", authenticate, getGroupDiscussionByIdController);

  return router;
};
