import { Router } from "express";
import { getAgoraToken } from "../controllers/call.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/calls/token", authenticate, getAgoraToken);

export default router;
