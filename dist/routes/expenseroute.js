import { Router } from 'express';
import { createExpense } from '../controllers/expenseController.js';
import { verifyToken } from '../middleware/authentication.js';
export const expenserouter = Router();
expenserouter.post('/create', verifyToken, createExpense);
//# sourceMappingURL=expenseroute.js.map