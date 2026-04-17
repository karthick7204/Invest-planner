import { Router } from 'express';
import { getDailyExpenses, syncDailyExpenses, getDailyExpenseByDate } from '../controllers/dailyExpenseController.js';
import { verifyToken } from '../middleware/authentication.js';
export const dailyExpenseRouter = Router();
// Route to get all daily expenses for a user
dailyExpenseRouter.get('/', verifyToken, getDailyExpenses);
// Route to sync and calculate daily expenses from the existing expense collection
dailyExpenseRouter.post('/sync', verifyToken, syncDailyExpenses);
// Route to get expense for a specific date (Format: YYYY-MM-DD)
dailyExpenseRouter.get('/:date', verifyToken, getDailyExpenseByDate);
//# sourceMappingURL=dailyExpenseRoute.js.map