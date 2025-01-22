import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { LegalChatbot } from '../services/ai/chatbot';

const chatbot = new LegalChatbot();

export const handleChat = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { message, language = 'english' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await chatbot.chat(message, language, req.user.id);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate response' });
  }
};

export const clearChat = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    chatbot.clearContext();
    res.json({ message: 'Chat context cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear chat context' });
  }
};