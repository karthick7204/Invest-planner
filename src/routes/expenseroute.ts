import {Router} from 'express'
import { createExpense } from '../controllers/expenseController.js';
import {createincome} from '../controllers/incomeController.js'
import { verifyToken } from '../middleware/authentication.js';
export const expenserouter = Router();

expenserouter.post('/create',verifyToken,createExpense)

expenserouter.post('/income',verifyToken,createincome)
