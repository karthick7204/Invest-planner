import { expense } from '../models/expenseModel.js'
import {  Response} from 'express'
import { authRequest } from '../middleware/authentication.js';

const secretkey = process.env.JWT_SECRET 

export const createExpense = async (req: authRequest , res:Response , )=>{
    const Userid = req.userId
    try{
        const expensedata = new expense(...req.body, Userid);
        const savedExpenseData = await expensedata.save();

        res.status(200).json({Userid,savedExpenseData})
        
    }catch(error){
        console.log("expense controller not wokring ")
        res.status(500).send("internal error")
    }
}
 