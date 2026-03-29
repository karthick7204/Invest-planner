import { budget } from '../models/budgetModel.js';
import { expense } from '../models/expenseModel.js';
import mongoose from 'mongoose';
export const setBudget = async (req, res) => {
    const userId = req.userId;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    const { category, limit, month } = req.body;
    if (!category || limit === undefined || !month) {
        return res.status(400).json({ message: "category, limit, and month (YYYY-MM) are required" });
    }
    try {
        const updatedBudget = await budget.findOneAndUpdate({ user: userId, category, month }, { limit }, { new: true, upsert: true });
        return res.status(200).json({ budget: updatedBudget });
    }
    catch (error) {
        return res.status(500).json({ message: "Error setting budget", error });
    }
};
export const getBudgets = async (req, res) => {
    const userId = req.userId;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    // Use query month or default to current
    const month = req.query.month || new Date().toISOString().substring(0, 7);
    try {
        const budgets = await budget.find({ user: userId, month });
        // Calculate spending per category for this month
        const startOfMonth = new Date(`${month}-01`);
        const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0, 23, 59, 59, 999);
        const spending = await expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: "$category",
                    spent: { $sum: "$amount" }
                }
            }
        ]);
        const formattedBudgets = budgets.map(b => {
            const categorySpent = spending.find(s => s._id === b.category)?.spent || 0;
            return {
                ...b.toObject(),
                spent: categorySpent,
                remaining: Math.max(0, b.limit - categorySpent),
                isExceeded: categorySpent > b.limit
            };
        });
        return res.status(200).json({ budgets: formattedBudgets });
    }
    catch (error) {
        console.error("getBudgets error:", error);
        return res.status(500).json({ message: "Error getting budgets", error });
    }
};
export const deleteBudget = async (req, res) => {
    const userId = req.userId;
    const { budgetId } = req.params;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        await budget.findOneAndDelete({ _id: budgetId, user: userId });
        return res.status(200).json({ message: "Budget deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error deleting budget", error });
    }
};
//# sourceMappingURL=budgetController.js.map