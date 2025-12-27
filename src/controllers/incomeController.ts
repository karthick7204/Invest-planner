import { income } from '../models/incomeModel.js'
import { Response} from 'express'
import { authRequest } from '../middleware/authentication.js';

export const createincome = async(req:authRequest,res:Response)=>{
       let userId = req.userId
       try{
               const incomeAmount = new income({
                    ...req.body,
                    userId
               })
               const savedIncomeAmount = await incomeAmount.save()
               if(!savedIncomeAmount){
                    return res.status(400).json({message:"no income data"})
                }
                return res.status(201).json({incomedata:savedIncomeAmount})
       }catch(error){
                 console.log(error)
                 return res.status(500).json({message:"error in incomecontrol",error})








           
     }
}