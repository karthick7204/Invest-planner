import { savings } from '../controllers/savingController.js';
import { verifyToken } from '../middleware/authentication.js';
import { Router } from 'express';
export const savingsroute = Router();
savingsroute.post('/savings', verifyToken, savings);
//# sourceMappingURL=savingsroute.js.map