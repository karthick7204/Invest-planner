import { Router } from 'express';
import { createExpense } from '../controllers/expenseController.js';
export const expenserouter = Router();
expenserouter.put('/create', createExpense);
//# sourceMappingURL=expenseroute.js.map