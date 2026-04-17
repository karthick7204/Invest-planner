import { Router } from 'express';
import { verifyToken } from '../middleware/authentication.js';
import { setBudget, getBudgets, deleteBudget } from '../controllers/budgetController.js';

export const budgetRouter = Router();

// Endpoint to set or update budget for a category and month
budgetRouter.post('/set', verifyToken, setBudget);

// Endpoint to fetch all budgets for a given month (default current month)
budgetRouter.get('/', verifyToken, getBudgets);

// Endpoint to delete a specific budget
budgetRouter.delete('/:budgetId', verifyToken, deleteBudget);
