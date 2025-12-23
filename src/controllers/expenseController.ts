import { expense } from '../models/expenseModel.js'
import {Request , Response} from 'express'
import { tokenauth } from '../middleware/authenticationToken.js';
import  dotenv  from 'dotenv';
import jwt from 'jsonwebtoken'

const secretkey = process.env.JWT_SECRET 

export const createExpense = async (req: Request , res:Response)=>{
    try{
        const expensedata = new expense(req.body);
        const savedExpenseData = await expensedata.save();
       
       tokenauth(secretkey);
        res.status(200).json(savedExpenseData)
        
    }catch(error){
        res.status(500).send("internal error")
    }
}