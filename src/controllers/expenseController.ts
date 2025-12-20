import { expense } from '../models/expenseModel.js'
import {Request , Response} from 'express'
import  dotenv  from 'dotenv';
import jwt from 'jsonwebtoken'

const secretkey = process.env.JWT_SECRET 

export const createExpense = async (req: Request , res:Response)=>{
    try{
        const expensedata = new expense(req.body);
        const savedExpenseData = await expensedata.save();

        const token:any = req.headers.authorization
        if(!token){
            res.status(500).json({message:"jwt not found"})
        }
        const decodedToken = jwt.verify(token,secretkey)
        res.status(200).json(savedExpenseData)
        
    }catch(error){
        res.status(500).send("internal error")
    }
}