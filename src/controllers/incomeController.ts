import { Response} from 'express'
import { authRequest } from '../middleware/authentication.js';
import { income } from '../models/incomeModel.js';
import { expense } from '../models/expenseModel.js';
import mongoose from 'mongoose';

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
          const userObjectId = new mongoose.Types.ObjectId(userId)
          const result = await income.aggregate([
               {
                    $match:{ user: userObjectId }
               },
               {
                    $group:{ _id:null, total:{$sum: "$income"} }
               }
          ])

          return res.status(200).json({ totalincome: result[0]?.total || 0 })
     }catch(error){
          console.log("totalIncome error", error)
          return res.status(500).json({message:"error in totalincome", error})
     }
}

