import { Router } from "express";
import { getAllTopics, getTopicById, createTopic, updateTopic, deleteTopic } from "../controllers/topic.controller";
import { authenticateAdmin } from "../middleware/adminAuth.middleware";
import { authenticate } from "../middleware/auth.middleware";
const router = Router();

router.get('/topics', authenticate, getAllTopics);

router.get("/topics/:id", authenticate, getTopicById);

router.post("/topics", authenticateAdmin, createTopic);

router.patch("/topics/:id", authenticateAdmin, updateTopic);

router.delete("/topics/:id", authenticateAdmin, deleteTopic);

export default router;