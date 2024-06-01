import express from "express";
import verifyToken from "../middlewares/auth";
import {
  getConversations,
  updateConversation,
  deleteConversation,
} from "../controllers/conversation.controllers";

const router = express.Router();

router
  .route("/")
  .get(verifyToken, getConversations)
  .put(verifyToken, updateConversation)
  .delete(verifyToken, deleteConversation);

export default router;
