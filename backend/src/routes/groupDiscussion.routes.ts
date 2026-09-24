import { Router } from "express";
import { createGroupDiscussionController, getUpcomingGroupDiscussionsController, reserveGroupDiscussionController, cancelGroupDiscussionReservationController, getUserGroupDiscussionReservationController, startGroupDiscussionController, endGroupDiscussionController } from "../controllers/groupDiscussion.controller.js";
import { authenticateAdmin } from "../middleware/adminAuth.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

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

router.post("/:id/start", authenticateAdmin, startGroupDiscussionController);

router.post("/:id/end", authenticateAdmin, endGroupDiscussionController);

export default router;
