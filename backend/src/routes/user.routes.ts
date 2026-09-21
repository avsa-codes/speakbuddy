import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {upload} from "../middleware/upload.middleware.js"
import { uploadProfilePhoto } from "../controllers/user.controller.js";
import {
  getUserProfile,
  getOwnProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/user.controller.js";

const router = Router();


router.get("/me", authenticate, getOwnProfile);

router.patch(
  "/me/photo",
  authenticate,
  upload.single("profilePhoto"),
  uploadProfilePhoto,
);

router.patch("/me", authenticate, updateProfile);

router.delete("/me", authenticate, deleteProfile);

router.get("/:id", authenticate, getUserProfile);

export default router;