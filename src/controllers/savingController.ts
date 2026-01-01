import { authRequest } from "../middleware/authentication.js"
import { Response } from "express"
import {savingCalculator} from "../service/savingCalculator.js"

export const savings = async (req:authRequest, res: Response) => {
    const requestUserId = req.userId;
    try{

    const [amount,duration,unit] = [req.body.amount, req.body.duration, req.body.unit];

    if (!requestUserId) {
        return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
    }   
    if (typeof duration !== 'number' || duration <= 0) {
        return res.status(400).json({ message: "Invalid duration" });
    }   
    if (typeof unit !== 'string' || (unit !== 'months' && unit !== 'years' && unit !== 'days')) {
        return res.status(400).json({ message: "Invalid unit" });
    }

    const savingsResult = savingCalculator(amount,duration,unit);

    return res.status(200).json({ message: "Savings calculated successfully", amountToSavePerDay: savingsResult });
} catch (error) {
    return res.status(500).json({ message: "Internal server error" });
}
}