import mongoose from "mongoose";
import { expense } from "../models/expenseModel.js";
export const totalExpenseAmount = async (userId) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const expenseResult = await expense.aggregate([
            {
                $match: { user: userObjectId }
            },
            {
                $group: { _id: null, totalexpense: { $sum: "$amount" } }
            }
        ]);
        return expenseResult[0]?.totalexpense || 0;
    }
    catch (error) {
        console.log("totalExpense service error", error);
        throw new Error("Error in calculating total expense");
    }
};
//# sourceMappingURL=totalExpense.js.map