import { dailyExpense } from '../models/dailyExpenseModel.js'
import { expense } from '../models/expenseModel.js'
import { Response } from 'express'
import { authRequest } from '../middleware/authentication.js';
import mongoose from 'mongoose'

// Fetch all daily expenses for the authenticated user
export const getDailyExpenses = async (req: authRequest, res: Response) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const dailyExpenses = await dailyExpense.find({ user: userId }).sort({ date: -1 });
        return res.status(200).json({ dailyExpenses });
    } catch (error) {
        console.log("getDailyExpenses error", error);
        return res.status(500).json({ message: "Internal error", error });
    }
}

// Calculate total expenses per day from the expenses collection and save into dailyExpense model
export const syncDailyExpenses = async (req: authRequest, res: Response) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const aggregated = await expense.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const results = [];
        for (const item of aggregated) {
            const dateStr = item._id;
            const total = item.totalAmount;
            
            // Update or create the daily expense record
            const updated = await dailyExpense.findOneAndUpdate(
                { user: userId, date: dateStr },
                { totalExpense: total },
                { new: true, upsert: true }
            );
            results.push(updated);
        }

        return res.status(200).json({ message: "Daily expenses synced successfully", data: results });
    } catch (error) {
        console.log("syncDailyExpenses error", error);
        return res.status(500).json({ message: "Internal error", error });
    }
}

// Fetch total expense for a specific date
export const getDailyExpenseByDate = async (req: authRequest, res: Response) => {
    const userId = req.userId;
    const { date } = req.params; // format expected 'YYYY-MM-DD'

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    if (!date) {
    return res.status(400).json({ message: "Date is required" });
}
    const userObjectId = new mongoose.Types.ObjectId(userId);
    try {
         const dailyRecord = await dailyExpense.findOne({
            user: userObjectId,
            date: date, // ✅ now it's guaranteed string
        });
        if (!dailyRecord) {
            return res.status(404).json({ message: "No expense recorded for this date", totalExpense: 0 });
        }
        return res.status(200).json({ dailyExpense: dailyRecord });
    } catch (error) {
        console.log("getDailyExpenseByDate error", error);
        return res.status(500).json({ message: "Internal error", error });
    }
}
