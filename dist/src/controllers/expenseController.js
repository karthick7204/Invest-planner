import { expense } from '../models/expenseModel.js';
import { transaction } from '../models/transactionModel.js';
import { totalExpenseAmount } from '../service/totalExpense.js';
import { dailyExpense } from '../models/dailyExpenseModel.js';
import { income } from '../models/incomeModel.js';
import mongoose from 'mongoose';
import { generateAIInsights } from '../service/geminiService.js';
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
            { $group: { _id: { $toLower: "$category" }, totalAmount: { $sum: "$amount" } } },
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
                        _id: { $toLower: "$category" },
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
export const getCategoryBreakdown = async (req, res) => {
    const userId = req.userId;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    const range = req.query.range || 'monthly';
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    let startDate;
    let endDate;
    if (range === 'yearly') {
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    }
    else if (range === 'quarterly') {
        const quarter = Math.floor((month - 1) / 3);
        startDate = new Date(year, quarter * 3, 1);
        endDate = new Date(year, (quarter + 1) * 3, 0, 23, 59, 59, 999);
    }
    else { // monthly
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0, 23, 59, 59, 999);
    }
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        // Get total income for percentage calculation
        const incomeResult = await income.aggregate([
            { $match: { user: userObjectId, date: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalIncomeValue = incomeResult[0]?.total || 0;
        // Get expenses aggregated by category
        const categoryData = await expense.aggregate([
            { $match: { user: userObjectId, date: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: { $toLower: "$category" }, totalAmount: { $sum: "$amount" } } },
            { $sort: { totalAmount: -1 } }
        ]);
        const breakdown = categoryData.map((item, index) => ({
            id: (index + 1).toString(),
            category: item._id.charAt(0).toUpperCase() + item._id.slice(1),
            amountSpent: `₹${item.totalAmount.toLocaleString()}`,
            percentageOfSalary: totalIncomeValue > 0 ? Math.round((item.totalAmount / totalIncomeValue) * 100) : 0
        }));
        return res.status(200).json({
            breakdown,
            totalIncome: totalIncomeValue,
            period: { startDate, endDate, range }
        });
    }
    catch (error) {
        console.error("getCategoryBreakdown error:", error);
        return res.status(500).json({ message: "Error in getCategoryBreakdown", error });
    }
};
export const deleteTransaction = async (req, res) => {
    const userId = req.userId;
    const { transactionId } = req.params;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const trans = await transaction.findOne({ _id: transactionId, user: userId });
        if (!trans) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        const transDate = new Date(trans.date);
        const dateStr = transDate.toISOString().split('T')[0];
        if (trans.type === "expense") {
            // Find and delete the matching expense
            // We use a range for the date slightly to be safe with timezones if they were saved differently
            const startOfDate = new Date(dateStr);
            const endOfDate = new Date(dateStr);
            endOfDate.setHours(23, 59, 59, 999);
            await expense.findOneAndDelete({
                user: userId,
                purpose: trans.topic,
                amount: trans.amount,
                category: trans.category,
                date: { $gte: startOfDate, $lte: endOfDate }
            });
            // Update dailyExpense
            await dailyExpense.findOneAndUpdate({ user: userId, date: dateStr }, { $inc: { totalExpense: -trans.amount } });
        }
        else if (trans.type === "income") {
            const startOfDate = new Date(dateStr);
            const endOfDate = new Date(dateStr);
            endOfDate.setHours(23, 59, 59, 999);
            await income.findOneAndDelete({
                user: userId,
                purpose: trans.topic,
                amount: trans.amount,
                category: trans.category,
                date: { $gte: startOfDate, $lte: endOfDate }
            });
        }
        // Delete the transaction record itself
        await transaction.findByIdAndDelete(transactionId);
        return res.status(200).json({ message: "Transaction deleted successfully" });
    }
    catch (error) {
        console.error("deleteTransaction error:", error);
        return res.status(500).json({ message: "Error deleting transaction", error });
    }
};
export const getAIAnalysis = async (req, res) => {
    const userId = req.userId;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        console.log("getAIAnalysis - Searching for transactions - UserID:", userId);
        const allTransactions = await transaction.find({ user: userId }).sort({ date: -1 }).limit(100);
        console.log(`getAIAnalysis - Found ${allTransactions.length} transactions`);
        if (allTransactions.length === 0) {
            return res.status(200).json({
                insights: [{
                        title: "Awaiting Data",
                        description: "Add your first transaction to unlock deep AI auditing via Gemini.",
                        icon: "Sparkles",
                        tag: "Info",
                        color: "bg-gray-50"
                    }],
                metrics: { healthScore: 0, savingsRatio: 0, netWorthVelocity: "Idle" }
            });
        }
        // Prepare data for Gemini with safe formatting
        const dataStr = allTransactions.map(t => {
            const dateObj = t.date ? (t.date instanceof Date ? t.date : new Date(t.date)) : new Date();
            const dateStr = !isNaN(dateObj.getTime()) ? dateObj.toISOString().split('T')[0] : 'N/A';
            return `${dateStr}: ${t.type} - ${t.category || 'N/A'} - ₹${t.amount} (${t.topic})`;
        }).join('\n');
        // Call Gemini
        try {
            const result = await generateAIInsights(dataStr);
            // Ensure result has insights
            if (!result || !result.insights || result.insights.length === 0) {
                throw new Error("Gemini returned empty insights");
            }
            return res.status(200).json(result);
        }
        catch (aiError) {
            console.error("Gemini processing error:", aiError);
            // Fallback for AI if it fails but we have data
            return res.status(200).json({
                insights: [{
                        title: "AI Momentarily Offline",
                        description: "We have your transactions, but Gemini is currenty having trouble analyzing them. Please try again in a few minutes.",
                        icon: "Zap",
                        tag: "Info",
                        color: "bg-yellow-50"
                    }],
                metrics: { healthScore: 50, savingsRatio: 0, netWorthVelocity: "Stable" }
            });
        }
    }
    catch (error) {
        console.error("AI Analysis Controller Error:", error);
        return res.status(500).json({
            message: "Failed to generate AI insights. Check GEMINI_API_KEY.",
            error: error.message
        });
    }
};
//# sourceMappingURL=expenseController.js.map