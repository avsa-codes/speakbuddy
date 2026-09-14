import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createRating } from "../controllers/rating.controller";

const router = Router();

router.post('/ratings/:userId', authenticate, createRating);

export default router;