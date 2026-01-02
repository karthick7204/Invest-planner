import { NseIndia } from "stock-nse-india-secure";
import { authRequest } from "../middleware/authentication.js";
import { Response } from "express";
import {stockCalculator} from '../service/stockCalculator.js'

const nse = new NseIndia();

export const displayStocks = async (req: authRequest, res: Response) => {
    try{
       const stocks = await nse.getEquityStockIndices("NIFTY 100")
       const stockSymbol = stocks.data.map((stock)=> ({
        symbol:stock.symbol,
        lastprice:stock.lastPrice
       }));
       const stockList = stockCalculator(stockSymbol);
       return res.status(200).json({ stockList })

}catch(error){
    console.log("displayStocks error", error)
    return res.status(500).json({ message: "internal error-displayStocks" })
}
}