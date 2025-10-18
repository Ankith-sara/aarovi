import express from 'express';
import { chatCompletion, generateProductDescription } from '../controllers/ChatController.js';

const ChatRouter = express.Router();

ChatRouter.post('/chat', chatCompletion);
ChatRouter.post('/generate-description', generateProductDescription);

export default ChatRouter;