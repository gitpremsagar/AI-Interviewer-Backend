import express from 'express';
const router = express.Router();

import { getResponseFromGeminAI, startChat } from '../controllers/message.controller';

// router.post('/prompt', getResponseFromGeminAI);

router.get('/', startChat);

export default router;