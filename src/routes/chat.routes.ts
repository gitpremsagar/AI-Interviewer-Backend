import express from 'express';
const router = express.Router();

import { getResponseFromGeminAI, startChat } from '../controllers/chat.controller';

router.post('/prompt', getResponseFromGeminAI);

router.get('/', startChat);

export default router;