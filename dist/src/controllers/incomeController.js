import { income } from '../models/incomeModel.js';
import { transaction } from '../models/transactionModel.js';
import mongoose from 'mongoose';
import { surplus } from '../service/investSurplus.js';
import { totalIncomeAmount } from '../service/totalIncome.js';
import { totalExpenseAmount } from '../service/totalExpense.js';
export const createincome = async (req, res) => {
    let userId = req.userId;
    try {
        const { purpose, amount, category, date } = req.body;
        if (!purpose || !category || amount === undefined) {
            return res.status(400).json({
                message: "purpose, amount and category are required"
            });
        }
        const incomedata = new income({
            user: userId,
            purpose,
            amount,
            category,
            date,
        });
        const savedIncomeAmount = await incomedata.save();
        // Create transaction record
        const transactionData = new transaction({
            user: userId,
            type: "income",
            topic: purpose,
            category,
            amount,
            date,
        });
        await transactionData.save();
        console.log("createincome - saved document:", savedIncomeAmount);
        if (!savedIncomeAmount) {
            return res.status(400).json({ message: "no income data" });
        }
        return res.status(201).json({ incomedataa: savedIncomeAmount });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error in incomecontrol", error });
    }
};
export const getIncome = async (req, res) => {
    const userId = req.userId;
    console.log("getIncome - userId:", userId);
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const incomedata = await income.find({ user: userId });
        console.log("getIncome - found:", incomedata);
        res.status(200).send({ income: incomedata });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error in getincome", error });
    }
};
export const totalIncome = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user id" });
    }
    try {
        const result = await totalIncomeAmount(userId);
        return res.status(200).json({ totalincome: result });
    }
    catch (error) {
        console.log("totalIncome error", error);
        return res.status(500).json({ message: "error in totalincome", error });
    }
};
export const deleteIncome = async (req, res) => {
    const incomeid = req.userId;
    try {
        const userObjectId = new mongoose.Types.ObjectId(incomeid);
        const deleteIncomedata = await income.findByIdAndDelete(userObjectId);
        if (!deleteIncomedata) {
            return res.status(400).json({ message: "no income data to delete" });
        }
        return res.status(200).json({ message: "income data deleted successfully" });
    }
    catch (error) {
        console.log("deleteIncome error", error);
        return res.status(500).json({ message: "error in deleteIncome", error });
    }
};
export const surplusIncome = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const Income_total = await totalIncomeAmount(userId); //these are service functions
        const Expense_total = await totalExpenseAmount(userId);
        const surplusamount = await surplus(Income_total, Expense_total);
        return res.status(200).json({ surplus: surplusamount });
    }
    catch (error) {
        console.log("surplusIncome error", error);
        return res.status(500).json({ message: "error in surplusIncome controller", error });
    }
};
//# sourceMappingURL=incomeController.js.map