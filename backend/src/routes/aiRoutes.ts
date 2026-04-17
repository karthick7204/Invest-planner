import { Router } from 'express';
import { getAIInsights, getAIInsightsNew } from '../controllers/aiController.js';
import { verifyToken } from '../middleware/authentication.js';

const router = Router();

// Endpoint as requested: POST /api/ai/insights/:userId
router.post('/insights/:userId', verifyToken, getAIInsights);

// New endpoint as requested: GET /api/insights/:userId (will be mounted at /api/ai/insights/:userId or /api/insights/:userId)
// Based on index.ts mounting at /api/ai, this will be /api/ai/insights/:userId with GET
router.get('/insights/:userId', verifyToken, getAIInsightsNew);

export default router;

 