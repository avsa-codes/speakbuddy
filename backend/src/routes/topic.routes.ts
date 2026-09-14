import { Router } from "express";
import { getAllTopics, getTopicById, createTopic, updateTopic, deleteTopic } from "../controllers/topic.controller";
import { authenticateAdmin } from "../middleware/adminAuth.middleware";
const router = Router();

router.get('/topics', getAllTopics);

router.get("/topics/:id", getTopicById);

router.post("/topics", authenticateAdmin, createTopic);

router.patch("/topics/:id", authenticateAdmin, updateTopic);

router.delete("/topics/:id", authenticateAdmin, deleteTopic);

export default router;