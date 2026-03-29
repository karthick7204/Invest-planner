import {Router} from 'express'
import { createExpense, getExpenses,totalExpense, getExpenseCategoryData, getTransactions, getGraphData } from '../controllers/expenseController.js';
import {createincome ,getIncome,totalIncome , deleteIncome,surplusIncome } from '../controllers/incomeController.js'
import { verifyToken } from '../middleware/authentication.js';
export const expenserouter = Router();

expenserouter.post('/create',verifyToken,createExpense)

expenserouter.post('/income',verifyToken,createincome)

expenserouter.get('/income',verifyToken,getIncome)

expenserouter.get('/totalincome',verifyToken,totalIncome) // not working as of now

expenserouter.get('/totalexpense',verifyToken,totalExpense) // not working as of now

expenserouter.get('/categorydata',verifyToken,getExpenseCategoryData)

expenserouter.get('/expenses',verifyToken,getExpenses)

expenserouter.get('/transactions',verifyToken,getTransactions)

expenserouter.get('/graphdata',verifyToken,getGraphData)

expenserouter.delete('/income',verifyToken,deleteIncome) // to be tested

expenserouter.get('/surplusincome',verifyToken,surplusIncome) // to be implemented
