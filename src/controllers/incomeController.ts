import { Response} from 'express'
import { authRequest } from '../middleware/authentication.js';
import { income } from '../models/incomeModel.js';
import { expense } from '../models/expenseModel.js';
import mongoose from 'mongoose';
import { surplus } from '../service/investSurplus.js';                                                                            
import { totalIncomeAmount } from '../service/totalIncome.js';
import { totalExpenseAmount } from '../service/totalExpense.js';
export const createincome = async(req:authRequest,res:Response)=>{
       let userId = req.userId
       try{
               const incomeAmount = new income({
                    user: userId,
                    income: req.body.income || req.body.amount
               })
               const savedIncomeAmount = await incomeAmount.save()
               console.log("createincome - saved document:", savedIncomeAmount)
               if(!savedIncomeAmount){
                    return res.status(400).json({message:"no income data"})
                }
                return res.status(201).json({incomedata:savedIncomeAmount})
       }catch(error){
                 console.log(error)
                 return res.status(500).json({message:"error in incomecontrol",error})

     }
}

export const getIncome = async(req:authRequest,res:Response)=>{
   const userId = req.userId
   console.log("getIncome - userId:", userId)

   if (!userId) {
      return res.status(401).json({message:"User not authenticated"})
   }

   try{
        const incomedata = await income.find({user:userId});
        console.log("getIncome - found:", incomedata)
        res.status(200
                  ).send({income:incomedata})          
   }catch(error){
     console.log(error)
     return res.status(500).json({message:"error in getincome",error})
   }
}

export const totalIncome = async(req:authRequest,res:Response)=>{
     const userId = req.userId

     if (!userId) {
          return res.status(401).json({ message: "User not authenticated" })
     }

     if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: "Invalid user id" })
     }

     try{
          const result = await totalIncomeAmount(userId)

          return res.status(200).json({ totalincome: result })
     }catch(error){
          console.log("totalIncome error", error)
          return res.status(500).json({message:"error in totalincome", error})
     }
}

export const deleteIncome = async(req:authRequest,res:Response)=>{

      const incomeid = req.userId
          try{
               const userObjectId = new mongoose.Types.ObjectId(incomeid)
               const deleteIncomedata = await income.findByIdAndDelete(userObjectId)
               if(!deleteIncomedata){
                    return res.status(400).json({message:"no income data to delete"})
               }                                            
               return res.status(200).json({message:"income data deleted successfully"})
          }catch(error){
               console.log("deleteIncome error", error)
               return res.status(500).json({message:"error in deleteIncome", error})
          }
}


export const surplusIncome = async  (req:authRequest,res:Response)=>{
     const userId = req.userId
       if (!userId) {
          return res.status(401).json({ message: "User not authenticated" })
     }
     try{
          const Income_total = await totalIncomeAmount(userId)  //these are service functions
          const Expense_total = await totalExpenseAmount(userId)
          const surplusamount = await surplus(Income_total,Expense_total) 
          return res.status(200).json({surplus: surplusamount})

     }catch(error){
     console.log("surplusIncome error", error)
     return res.status(500).json({message:"error in surplusIncome controller", error})
}
}