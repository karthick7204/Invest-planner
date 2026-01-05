import { NseIndia } from "stock-nse-india-secure";
import { authRequest } from "../middleware/authentication.js";
import { Response } from "express";
import {stockCalculator} from '../service/stockCalculator.js'
import { totalIncomeAmount } from "../service/totalIncome.js";
import { totalExpenseAmount } from "../service/totalExpense.js";
import { surplus } from "../service/investSurplus.js";
const nse = new NseIndia();

export const displayStocks = async (req: authRequest, res: Response) => {
    const userId = req.userId
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" })
    }
    try{
       const stocks = await nse.getEquityStockIndices("NIFTY 100")
       const stockSymbol = stocks.data.map((stock)=> ({
        symbol:stock.symbol,
        lastprice:stock.lastPrice
       }));
        const Income_total = await totalIncomeAmount(userId)
        const Expense_total = await totalExpenseAmount(userId)
        const surplusamount = await surplus(Income_total,Expense_total) 
        const stockList = stockCalculator(stockSymbol,surplusamount);
      
        return res.status(200).json({ surplusamount,stockList })

}catch(error){
    console.log("displayStocks error", error)
    return res.status(500).json({ message: "internal error-displayStocks" })
}
}