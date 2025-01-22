import { Router } from 'express';
import { handleChat, clearChat } from '../controllers/chat';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/message', handleChat);
router.post('/clear', clearChat);

export default router;