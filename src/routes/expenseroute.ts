import {Router} from 'express'
import { createExpense, getExpenses,totalExpense } from '../controllers/expenseController.js';
import {createincome ,getIncome,totalIncome , deleteIncome,surplusIncome } from '../controllers/incomeController.js'
import { verifyToken } from '../middleware/authentication.js';
export const expenserouter = Router();

expenserouter.post('/create',verifyToken,createExpense)

expenserouter.post('/income',verifyToken,createincome)

expenserouter.get('/income',verifyToken,getIncome)

expenserouter.get('/totalincome',verifyToken,totalIncome) // not wokrinhg as of now

expenserouter.get('/totalexpense',verifyToken,totalExpense) // not working as of now

expenserouter.get('/expenses',verifyToken,getExpenses)

expenserouter.delete('/income',verifyToken,deleteIncome) // to be tested

expenserouter.get('/surplusincome',verifyToken,surplusIncome) // to be implemented