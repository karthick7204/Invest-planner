import { expense } from '../models/expenseModel.js';
import { transaction } from '../models/transactionModel.js';
import { totalExpenseAmount } from '../service/totalExpense.js';
import mongoose from 'mongoose';
export const createExpense = async (req, res) => {
    const UserId = req.userId;
    console.log("createExpense - UserId:", UserId);
    try {
        if (!UserId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const { purpose, amount, category, date } = req.body;
        if (!purpose || !category || amount === undefined) {
            return res.status(400).json({
                message: "purpose, amount and category are required"
            });
        }
        const expensedata = new expense({
            user: UserId,
            purpose,
            amount,
            category,
            date,
        });
        const savedExpenseData = await expensedata.save();
        // Create transaction record
        const transactionData = new transaction({
            user: UserId,
            type: "expense",
            topic: purpose,
            category,
            amount,
            date,
        });
        await transactionData.save();
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
//# sourceMappingURL=expenseController.js.map