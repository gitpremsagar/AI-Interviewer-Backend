import express from "express";
import verifyToken from "../middlewares/auth";

const router = express.Router();

import {
  startChat,
  getMessagesByConversationId,
} from "../controllers/message.controller";

router.post("/", verifyToken, startChat);

// get messages by conversationId
router.get("/:conversationId", getMessagesByConversationId);

export default router;
