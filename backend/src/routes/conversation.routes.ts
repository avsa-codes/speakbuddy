import { Router } from "express";
import { createConversation } from "../controllers/conversation.controller";

const router = Router();

router.post('/conversations', createConversation);

// router.get('/conversations/:id');

// router.patch("/conversations/:id");

export default router;