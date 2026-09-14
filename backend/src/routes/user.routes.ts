import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getUserProfile,
  getOwnProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/me", authenticate, getOwnProfile);

router.get("/:id", authenticate, getUserProfile);

router.patch("/me", authenticate, updateProfile);

router.delete("/me", authenticate, deleteProfile);

export default router;