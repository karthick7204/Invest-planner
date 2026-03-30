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
    // New parameters for broader range support
    const range = req.query.range || 'monthly'; // 'monthly', 'quarterly', 'yearly'
    const monthStr = req.query.month || new Date().toISOString().substring(0, 7);
    const selectedDate = new Date(`${monthStr}-01`);
    let startDate;
    let endDate;
    let budgetQuery = { user: userId };
    try {
        if (range === 'yearly') {
            const year = selectedDate.getFullYear();
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31, 23, 59, 59, 999);
            // Find all budgets for this year
            budgetQuery.month = { $regex: `^${year}-` };
        }
        else if (range === 'quarterly') {
            const month = selectedDate.getMonth();
            const quarter = Math.floor(month / 3);
            startDate = new Date(selectedDate.getFullYear(), quarter * 3, 1);
            endDate = new Date(selectedDate.getFullYear(), (quarter + 1) * 3, 0, 23, 59, 59, 999);
            // Generate list of months for the quarter for budget matching
            const quarterMonths = [];
            for (let i = 0; i < 3; i++) {
                const m = quarter * 3 + i + 1;
                quarterMonths.push(`${selectedDate.getFullYear()}-${m.toString().padStart(2, '0')}`);
            }
            budgetQuery.month = { $in: quarterMonths };
        }
        else { // 'monthly'
            startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
            budgetQuery.month = monthStr;
        }
        // Get budgets for the range
        const budgets = await budget.find(budgetQuery);
        // Sum limits by category across the range
        // If a category has multiple budgets (e.g., in a quarterly view), we sum their limits
        const aggregatedBudgetsMap = new Map();
        budgets.forEach(b => {
            const current = aggregatedBudgetsMap.get(b.category) || 0;
            aggregatedBudgetsMap.set(b.category, current + b.limit);
        });
        // Get spending aggregated by category for the range
        const spending = await expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: "$category",
                    spent: { $sum: "$amount" }
                }
            }
        ]);
        // Combine logic: all categories that have a budget OR have spending
        const categories = new Set([
            ...aggregatedBudgetsMap.keys(),
            ...spending.map(s => s._id)
        ]);
        const result = Array.from(categories).map(cat => {
            const limit = aggregatedBudgetsMap.get(cat) || 0;
            const spent = spending.find(s => s._id === cat)?.spent || 0;
            return {
                category: cat,
                limit,
                spent,
                remaining: Math.max(0, limit - spent),
                isExceeded: spent > limit
            };
        });
        return res.status(200).json({ budgets: result });
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