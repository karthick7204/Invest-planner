import mongoose from "mongoose";
import { income } from "../models/incomeModel.js";
export const totalIncomeAmount = async (userId) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const result = await income.aggregate([
            {
                $match: { user: userObjectId }
            },
            {
                $group: { _id: null, total: { $sum: "$income" } }
            }
        ]);
        return result[0]?.total || 0;
    }
    catch (error) {
        console.log("totalExpense service error", error);
        throw new Error("Error in calculating total expense");
    }
};
//# sourceMappingURL=totalIncome.js.map