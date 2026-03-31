import { budget } from '../models/budgetModel.js';
import { expense } from '../models/expenseModel.js';
import { Response } from 'express';
import { authRequest } from '../middleware/authentication.js';
import mongoose from 'mongoose';

export const setBudget = async (req: authRequest, res: Response) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    let { category, limit, month } = req.body;
    if (!category || limit === undefined || !month) {
        return res.status(400).json({ message: "category, limit, and month (YYYY-MM) are required" });
    }

    // Normalize category to avoid duplicates like "Rent" and "rent"
    const normalizedCategory = category.trim();

    try {
        // Use a case-insensitive find to update existing category regardless of casing
        const updatedBudget = await budget.findOneAndUpdate(
            { 
                user: userId, 
                category: { $regex: new RegExp(`^${normalizedCategory}$`, 'i') }, 
                month 
            },
            { limit, category: normalizedCategory }, // Update with the provided casing
            { new: true, upsert: true }
        );
        return res.status(200).json({ budget: updatedBudget });
    } catch (error) {
        return res.status(500).json({ message: "Error setting budget", error });
    }
};

export const getBudgets = async (req: authRequest, res: Response) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // New parameters for broader range support
    const range = req.query.range as string || 'monthly'; // 'monthly', 'quarterly', 'yearly'
    const monthStr = req.query.month as string || new Date().toISOString().substring(0, 7);
    const selectedDate = new Date(`${monthStr}-01`);

    let startDate: Date;
    let endDate: Date;
    let budgetQuery: any = { user: userId };

    try {
        if (range === 'yearly') {
            const year = selectedDate.getFullYear();
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31, 23, 59, 59, 999);
            // Find all budgets for this year
            budgetQuery.month = { $regex: `^${year}-` };
        } else if (range === 'quarterly') {
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
        } else { // 'monthly'
            startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
            budgetQuery.month = monthStr;
        }

        // Get budgets for the range
        const budgets = await budget.find(budgetQuery);
        
        // Sum limits by category across the range and keep track of IDs
        // Normalize categories to lowercase for consistent matching
        const aggregatedBudgetsMap = new Map<string, { limit: number, ids: string[], originalCategory: string }>();
        budgets.forEach(b => {
            const lowerCat = b.category.toLowerCase();
            const current = aggregatedBudgetsMap.get(lowerCat) || { limit: 0, ids: [], originalCategory: b.category };
            aggregatedBudgetsMap.set(lowerCat, {
                limit: current.limit + b.limit,
                ids: [...current.ids, b._id.toString()],
                originalCategory: current.originalCategory // Keep the first casing encountered
            });
        });

        // Get spending aggregated by category for the range (case-insensitive)
        const spending = await expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $toLower: "$category" },
                    spent: { $sum: "$amount" }
                }
            }
        ]);

        // Filter: ONLY show categories that have an explicit budget record
        const result = Array.from(aggregatedBudgetsMap.keys()).map(lowerCat => {
            const budgetData = aggregatedBudgetsMap.get(lowerCat)!;
            const spent = spending.find(s => s._id === lowerCat)?.spent || 0;
            return {
                _id: budgetData.ids[0], // Use the first found ID for deletion
                additionalIds: budgetData.ids.slice(1),
                category: budgetData.originalCategory, // Display original casing
                limit: budgetData.limit,
                spent,
                remaining: Math.max(0, budgetData.limit - spent),
                isExceeded: spent > budgetData.limit
            };
        });

        return res.status(200).json({ budgets: result });
    } catch (error) {
        console.error("getBudgets error:", error);
        return res.status(500).json({ message: "Error getting budgets", error });
    }
};
export const deleteBudget = async (req: authRequest, res: Response) => {
    const userId = req.userId;
    const { budgetId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    try {
        await budget.findOneAndDelete({ _id: budgetId, user: userId });
        return res.status(200).json({ message: "Budget deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting budget", error });
    }
};
