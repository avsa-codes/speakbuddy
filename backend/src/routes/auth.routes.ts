import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "../middleware/auth.middleware.js";

import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/auth.controller.js";

const router = Router();

router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),

    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long."),

    body("name").trim().notEmpty().withMessage("Name is required."),

    body("username").trim().notEmpty().withMessage("Username is required."),
  ],
  register,
);
router.post("/login", login);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);

export default router;
