import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { expense } from '../models/expenseModel.js';
import { budget } from '../models/budgetModel.js';
import { totalIncomeAmount } from '../service/totalIncome.js';
import { totalExpenseAmount } from '../service/totalExpense.js';
import { generateAIInsightsStrict, generateNaturalLanguageInsight } from '../service/geminiService.js';

export const getAIInsights = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid or missing User ID" });
    }

    try {
        console.log("🔍 AI Insights - Fetching data for UserID:", userId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // 1. Fetch Total Income (Salary substitute)
        const salary = await totalIncomeAmount(userId);
        console.log("📊 Salary:", salary);

        // 2. Fetch Total Expense
        const totalExpenses = await totalExpenseAmount(userId);
        console.log("📊 Total Expenses:", totalExpenses);

        // 3. Aggregate expenses by category
        const categoryExpenses = await expense.aggregate([
            { $match: { user: userObjectId } },
            { $group: { _id: "$category", amount: { $sum: "$amount" } } },
            { $sort: { amount: -1 } },
            { $limit: 3 } 
        ]);
        console.log("📊 Category Breakdown:", categoryExpenses);

        const mappedCategoryExpenses = categoryExpenses.map(cat => ({
            category: cat._id,
            amount: cat.amount
        }));

        // 4. Calculate Surplus
        const surplus = salary - totalExpenses;

        // 5. Build data object for Gemini
        const financialData = {
            salary,
            total_expenses: totalExpenses,
            category_expenses: mappedCategoryExpenses,
            investments: 0, 
            surplus
        };

        // 6. Call Gemini Service
        console.log("🧠 Consulting Gemini AI...");
        const aiResponse = await generateAIInsightsStrict(financialData);
        console.log("✅ AI Response received");

        return res.status(200).json({
            ...aiResponse,
            metrics: financialData
        });

    } catch (error: any) {
        console.error("❌ AI Insights Error:", error);
        return res.status(500).json({ 
            message: "Internal Server Error in Wealth AI module", 
            error: error.message 
        });
    }
};

export const getAIInsightsNew = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid or missing User ID" });
    }

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0] || "";

        // Date boundaries
        const todayIdx = now.getDay(); // 0-6
        const diffToMon = todayIdx === 0 ? -6 : 1 - todayIdx;
        const monday = new Date(now);
        monday.setDate(now.getDate() + diffToMon);
        monday.setHours(0,0,0,0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const daysElapsed = now.getDate();

        // 1. Current Week Daily Spending
        const thisWeekData = await expense.aggregate([
            { 
                $match: { 
                    user: userObjectId, 
                    date: { $gte: monday, $lte: now } 
                } 
            },
            {
                $group: {
                    _id: { 
                        day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        category: "$category"
                    },
                    amount: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    day: "$_id.day",
                    category: "$_id.category",
                    amount: 1
                }
            }
        ]);

        // 2. This Month vs Last Month
        const spendingComparison = await expense.aggregate([
            {
                $match: {
                    user: userObjectId,
                    date: { $gte: startOfLastMonth }
                }
            },
            {
                $group: {
                    _id: {
                        category: "$category",
                        isCurrentMonth: { $gte: ["$date", startOfMonth] }
                    },
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // 3. Get Budgets
        const userBudgets = await budget.find({ 
            user: userObjectId, 
            month: todayStr.substring(0, 7) 
        });

        const defaultBudgets: Record<string, number> = { 
            Food: 6000, Transport: 2000, Shopping: 4000, 
            Entertainment: 3000, Health: 2000, Other: 2000 
        };

        const budgetMap = new Map();
        userBudgets.forEach(b => budgetMap.set(b.category, b.limit));

        // Aggregate into monthlyByCategory
        const categories = new Set([...spendingComparison.map(s => s._id.category), ...Object.keys(defaultBudgets)]);
        
        const monthlyByCategory = Array.from(categories).map(cat => {
            const spentSoFar = spendingComparison.find(s => s._id.category === cat && s._id.isCurrentMonth)?.total || 0;
            const lastMonth = spendingComparison.find(s => s._id.category === cat && !s._id.isCurrentMonth)?.total || 0;
            const bLimit = budgetMap.get(cat) || defaultBudgets[cat] || 2000;
            
            const projectedTotal = (spentSoFar / (daysElapsed || 1)) * daysInMonth;
            const willOverspend = projectedTotal > bLimit;
            const overspendBy = willOverspend ? projectedTotal - bLimit : 0;

            return {
                category: cat,
                spentSoFar,
                budget: bLimit,
                lastMonth,
                projectedTotal,
                willOverspend,
                overspendBy
            };
        });

        const insightPayload = {
            today: todayStr,
            daysElapsed,
            daysInMonth,
            thisWeek: thisWeekData,
            monthlyByCategory
        };

        // 4. Call AI
        const insight = await generateNaturalLanguageInsight(insightPayload);

        return res.status(200).json({ insight });

    } catch (error: any) {
        console.error("❌ AI New Insights Error:", error);
        return res.status(500).json({ 
            message: "Internal Server Error in AIService", 
            error: error.message 
        });
    }
};

