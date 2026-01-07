import { expense } from '../models/expenseModel.js'
import {  Response} from 'express'
import { authRequest } from '../middleware/authentication.js';
import {totalExpenseAmount} from '../service/totalExpense.js';
import mongoose from 'mongoose'

export const createExpense = async (req: authRequest , res:Response  )=>{  //for creating expense
    const UserId = req.userId
    console.log("createExpense - UserId:", UserId)
    try{
        const expensedata = new expense({...req.body, user: UserId});
        const savedExpenseData = await expensedata.save();
        console.log("createExpense - saved expense:", savedExpenseData)

        res.status(200).json({savedExpenseData})
        
    }catch(error){
        console.log("expense controller not wokring ",error)
        res.status(500).send("internal error-expensecontrol")
    }
}

export const getExpenses = async (req: authRequest, res: Response) => { //for getting expenses
    const userId = req.userId
    console.log("getExpenses - searching for userId:", userId)
    try {
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" })
        }
            
        const items = await expense.find({ user: userId })
        return res.status(200).json({ expenses: items })
        
    } catch (error) {
        console.log("getExpenses error", error)
        return res.status(500).json({ message: "internal error-getExpenses" })
    }
}

export const totalExpense = async(req:authRequest,res:Response)=>{  //for total expense amount
    const userId = req.userId
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user id" })
    }

    try{
        const expenseResult = await totalExpenseAmount(userId)

        return res.status(200).json({totalexpense: expenseResult})
    }catch(error){
        console.log("totalExpense error", error)
        return res.status(500).json({message:"error in totalExpense", error})
    }
}  