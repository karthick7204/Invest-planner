import { Response} from 'express'
import { authRequest } from '../middleware/authentication.js';
import { income } from '../models/incomeModel.js';
import { expense } from '../models/expenseModel.js';
import mongoose from 'mongoose';
import { surplus } from '../service/investSurplus.js';                                                                            
import { totalIncomeAmount } from '../service/totalIncome.js';
import { totalExpenseAmount } from '../service/totalExpense.js';
import { splitUpCalculation } from '../service/splitUpCalculation.js';

export const investsplit = async(req:authRequest,res:Response)=>{
        const userId = req.userId
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" })
        }   
         try{
          const Income_total = await totalIncomeAmount(userId)
          const Expense_total = await totalExpenseAmount(userId)
          const surplusamount = await surplus(Income_total,Expense_total) 

          const {stocks,mutualfunds,gold} = req.body //eg: {stocks:50,mutualfunds:30,gold:20}
          const splitResult = splitUpCalculation(stocks,mutualfunds,gold,surplusamount)

          return res.status(200).json({investsplit:splitResult})

     }catch(error){
     console.log("surplusIncome error", error)
     return res.status(500).json({message:"error in surplusIncome controller", error})
}
}