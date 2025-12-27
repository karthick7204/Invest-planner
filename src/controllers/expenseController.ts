import { expense } from '../models/expenseModel.js'
import {  Response} from 'express'
import { authRequest } from '../middleware/authentication.js';

export const createExpense = async (req: authRequest , res:Response  )=>{
    const UserId = req.userId
    try{
        const expensedata = new expense({...req.body, user: UserId});
        const savedExpenseData = await expensedata.save();

        res.status(200).json({savedExpenseData})
        
    }catch(error){
        console.log("expense controller not wokring ",error)
        res.status(500).send("internal error-expensecontrol")
    }
}


 