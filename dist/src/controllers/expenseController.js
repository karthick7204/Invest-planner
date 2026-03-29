import { expense } from '../models/expenseModel.js';
import { transaction } from '../models/transactionModel.js';
import { totalExpenseAmount } from '../service/totalExpense.js';
import { dailyExpense } from '../models/dailyExpenseModel.js';
import mongoose from 'mongoose';
export const createExpense = async (req, res) => {
    const userId = req.userId;
    console.log("createExpense - UserId:", userId);
    try {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const { purpose, amount, category, date } = req.body;
        if (!purpose || !category || amount === undefined) {
            return res.status(400).json({
                message: "purpose, amount and category are required"
            });
        }
        const dateObj = date ? new Date(date) : new Date();
        const dateStr = dateObj.toISOString().split('T')[0];
        const expensedata = new expense({
            user: userObjectId,
            purpose,
            amount,
            category,
            date: dateStr,
        });
        const savedExpenseData = await expensedata.save();
        // Create transaction record
        const transactionData = new transaction({
            user: userObjectId,
            type: "expense",
            topic: purpose,
            category,
            amount,
            date,
        });
        await transactionData.save();
        // Update daily expense
        await dailyExpense.findOneAndUpdate({
            user: userObjectId,
            date: dateStr,
        }, {
            $inc: { totalExpense: Number(amount) },
        }, {
            new: true,
            upsert: true,
        });
        console.log("createExpense - saved expense:", savedExpenseData);
        return res.status(200).json({ savedExpenseData });
    }
    catch (error) {
        console.log("expense controller not wokring ", error);
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors,
            });
        }
        return res.status(500).send("internal error-expensecontrol");
    }
};
export const getExpenses = async (req, res) => {
    const userId = req.userId;
    console.log("getExpenses - searching for userId:", userId);
    try {
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const items = await expense.find({ user: userId });
        return res.status(200).json({ expenses: items });
    }
    catch (error) {
        console.log("getExpenses error", error);
        return res.status(500).json({ message: "internal error-getExpenses" });
    }
};
export const totalExpense = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user id" });
    }
    try {
        const expenseResult = await totalExpenseAmount(userId);
        return res.status(200).json({ totalexpense: expenseResult });
    }
    catch (error) {
        console.log("totalExpense error", error);
        return res.status(500).json({ message: "error in totalExpense", error });
    }
};
export const getExpenseCategoryData = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user id" });
    }
    try {
        const categoryData = await expense.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
            { $project: { _id: 0, name: "$_id", value: "$totalAmount" } }
        ]);
        return res.status(200).json({ categoryData });
    }
    catch (error) {
        console.log("getExpenseCategoryData error", error);
        return res.status(500).json({ message: "error in getExpenseCategoryData", error });
    }
};
export const getTransactions = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const limit = parseInt(req.query.limit) || 10;
        const transactions = await transaction.find({ user: userId })
            .sort({ date: -1 })
            .limit(limit);
        return res.status(200).json({ transactions });
    }
    catch (error) {
        console.log("getTransactions error", error);
        return res.status(500).json({ message: "error in getTransactions", error });
    }
};
export const getGraphData = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const mode = req.query.mode || 'daily'; // 'daily' or 'category'
        const date = req.query.date || new Date().toISOString().split('T')[0];
        if (mode === 'category') {
            // Get expenses by category for a specific day
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            const categoryData = await transaction.aggregate([
                {
                    $match: {
                        user: new mongoose.Types.ObjectId(userId),
                        type: "expense",
                        date: { $gte: startOfDay, $lte: endOfDay }
                    }
                },
                {
                    $group: {
                        _id: "$category",
                        expenses: { $sum: "$amount" }
                    }
                },
                { $sort: { expenses: -1 } }
            ]);
            const formattedData = categoryData.map(item => ({
                name: item._id,
                expenses: item.expenses
            }));
            return res.status(200).json({ graphData: formattedData });
        }
        else {
            // Default: Get daily total expenses for the last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const graphDataDB = await transaction.aggregate([
                {
                    $match: {
                        user: new mongoose.Types.ObjectId(userId),
                        type: "expense",
                        date: { $gte: thirtyDaysAgo }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        expenses: { $sum: "$amount" }
                    }
                },
                { $sort: { _id: 1 } },
            ]);
            const formattedData = graphDataDB.map(item => {
                const dateObj = new Date(item._id);
                const dayStr = dateObj.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
                return {
                    day: dayStr,
                    expenses: item.expenses
                };
            });
            return res.status(200).json({ graphData: formattedData });
        }
    }
    catch (error) {
        console.log("getGraphData error", error);
        return res.status(500).json({ message: "error in getGraphData", error });
    }
};
//# sourceMappingURL=expenseController.js.map