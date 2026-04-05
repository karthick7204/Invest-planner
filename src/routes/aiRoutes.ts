import { Router } from 'express';
import { getAIInsights } from '../controllers/aiController.js';
import { verifyToken } from '../middleware/authentication.js';

const router = Router();

// Endpoint as requested: POST /api/ai/insights/:userId
router.post('/insights/:userId', verifyToken, getAIInsights);

export default router;
 