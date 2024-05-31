import express from "express";
import verifyToken from "../middlewares/auth";

const router = express.Router();

import { startChat } from "../controllers/message.controller";

router.post("/", verifyToken, startChat);

export default router;
