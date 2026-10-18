import mongoose from "mongoose";
import { expense } from "../models/expenseModel.js";
import { budget } from "../models/budgetModel.js";
import { generateAIInsightsStrict, generateNaturalLanguageInsight, } from "../service/geminiService.js";
import { fetchUserFinancialData } from "../service/financialReportService.js";
/**
 * Generate a comprehensive personalized Financial Report using Gemini AI
 * based on authenticated user's actual MongoDB income, expenses, transactions,
 * budgets, and investments.
 *
 * Endpoint: GET /ai/report or POST /ai/report
 */
export const getFinancialReport = async (req, res) => {
    const userId = req.userId;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(401).json({ message: "Unauthorized: Invalid or missing authentication token" });
    }
    try {
        console.log("📊 Generating AI Financial Report for authenticated user:", userId);
        // 1. Fetch real user data & calculate all financial metrics accurately
        const { metrics, dataStr, rawSummary } = await fetchUserFinancialData(userId);
        // 2. Prepare structured data payload for Gemini
        const geminiPayload = {
            salary: metrics.totalIncome,
            total_expenses: metrics.totalExpenses,
            surplus: metrics.netSurplus,
            savings_ratio: `${metrics.savingsRatio}%`,
            expense_ratio: `${metrics.expenseRatio}%`,
            health_score: `${metrics.healthScore}/100`,
            net_worth_velocity: metrics.netWorthVelocity,
            investments: {
                actual_invested: metrics.investments.totalActualInvested,
                investable_surplus: metrics.investments.investableSurplus,
                suggested_allocation: metrics.investments.suggestedSplit,
            },
            category_breakdown: metrics.categoryExpenses.map((c) => ({
                category: c.category,
                amount: c.amount,
                percentage_of_expenses: `${c.percentageOfTotal}%`,
            })),
            budget_adherence: {
                total_budget: metrics.budgetMetrics.totalBudgetLimit,
                total_spent: metrics.budgetMetrics.totalBudgetSpent,
                utilization_percent: `${metrics.budgetMetrics.overallUtilizationPercent}%`,
                overspent_categories: metrics.budgetMetrics.overspentCategories,
            },
            records_summary: rawSummary,
        };
        // 3. Pass prepared data to Gemini function
        console.log("🧠 Consulting Gemini AI for financial report...");
        const aiResponse = await generateAIInsightsStrict(geminiPayload);
        console.log("✅ Gemini report generated successfully");
        return res.status(200).json({
            report: {
                title: aiResponse.title,
                generatedAt: new Date().toISOString(),
                healthScore: metrics.healthScore,
                savingsRatio: metrics.savingsRatio,
                netWorthVelocity: metrics.netWorthVelocity,
                insights: aiResponse.insights,
                suggestions: aiResponse.suggestions,
                investmentAdvice: aiResponse.investmentAdvice,
            },
            metrics,
            summary: rawSummary,
        });
    }
    catch (error) {
        console.error("❌ Financial Report Controller Error:", error);
        return res.status(502).json({
            message: "Failed to generate AI financial report from Gemini",
            error: error.message || String(error),
        });
    }
};
/**
 * Controller for AI Insights (POST /ai/insights/:userId).
 * Strictly enforces user isolation so users cannot query another user's financial data.
 */
export const getAIInsights = async (req, res) => {
    const authenticatedUserId = req.userId;
    const requestedUserId = req.params.userId;
    if (!authenticatedUserId || !mongoose.Types.ObjectId.isValid(authenticatedUserId)) {
        return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
    }
    // Security & User Isolation Check: Prevent access to other users' financial data
    if (requestedUserId && requestedUserId !== authenticatedUserId) {
        console.warn(`🚨 User isolation breach attempt: user ${authenticatedUserId} requested ${requestedUserId}`);
        return res.status(403).json({
            message: "Access forbidden: You cannot access another user's financial data",
        });
    }
    try {
        console.log("🔍 AI Insights - Fetching data for authenticated UserID:", authenticatedUserId);
        // 1. Fetch real user data & calculate accurate metrics from MongoDB
        const { metrics } = await fetchUserFinancialData(authenticatedUserId);
        // 2. Prepare data object for Gemini
        const financialData = {
            salary: metrics.totalIncome,
            total_expenses: metrics.totalExpenses,
            category_expenses: metrics.categoryExpenses.map((cat) => ({
                category: cat.category,
                amount: cat.amount,
            })),
            investments: metrics.investments.totalActualInvested,
            surplus: metrics.netSurplus,
        };
        // 3. Call Gemini Service with strict validation
        console.log("🧠 Consulting Gemini AI for user insights...");
        const aiResponse = await generateAIInsightsStrict(financialData);
        console.log("✅ AI Response received");
        return res.status(200).json({
            ...aiResponse,
            metrics: financialData,
            calculatedMetrics: metrics,
        });
    }
    catch (error) {
        console.error("❌ AI Insights Error:", error);
        return res.status(502).json({
            message: "Failed to generate AI insights from Gemini",
            error: error.message || String(error),
        });
    }
};
/**
 * Controller for Natural Language AI Insight summary (GET /ai/insights/:userId).
 * Strictly enforces user isolation.
 */
export const getAIInsightsNew = async (req, res) => {
    const authenticatedUserId = req.userId;
    const requestedUserId = req.params.userId;
    if (!authenticatedUserId || !mongoose.Types.ObjectId.isValid(authenticatedUserId)) {
        return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
    }
    // Security & User Isolation Check
    if (requestedUserId && requestedUserId !== authenticatedUserId) {
        console.warn(`🚨 User isolation breach attempt: user ${authenticatedUserId} requested ${requestedUserId}`);
        return res.status(403).json({
            message: "Access forbidden: You cannot access another user's financial data",
        });
    }
    try {
        const userObjectId = new mongoose.Types.ObjectId(authenticatedUserId);
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0] || "";
        // Date boundaries
        const todayIdx = now.getDay(); // 0-6
        const diffToMon = todayIdx === 0 ? -6 : 1 - todayIdx;
        const monday = new Date(now);
        monday.setDate(now.getDate() + diffToMon);
        monday.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const daysElapsed = now.getDate();
        // 1. Current Week Daily Spending for authenticated user
        const thisWeekData = await expense.aggregate([
            {
                $match: {
                    user: userObjectId,
                    date: { $gte: monday, $lte: now },
                },
            },
            {
                $group: {
                    _id: {
                        day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        category: "$category",
                    },
                    amount: { $sum: "$amount" },
                },
            },
            {
                $project: {
                    _id: 0,
                    day: "$_id.day",
                    category: "$_id.category",
                    amount: 1,
                },
            },
        ]);
        // 2. Spending comparison for authenticated user
        const spendingComparison = await expense.aggregate([
            {
                $match: {
                    user: userObjectId,
                    date: { $gte: startOfLastMonth },
                },
            },
            {
                $group: {
                    _id: {
                        category: "$category",
                        isCurrentMonth: { $gte: ["$date", startOfMonth] },
                    },
                    total: { $sum: "$amount" },
                },
            },
        ]);
        // 3. Budgets for authenticated user
        const userBudgets = await budget.find({
            user: userObjectId,
            month: todayStr.substring(0, 7),
        });
        const defaultBudgets = {
            Food: 6000,
            Transport: 2000,
            Shopping: 4000,
            Entertainment: 3000,
            Health: 2000,
            Other: 2000,
        };
        const budgetMap = new Map();
        userBudgets.forEach((b) => budgetMap.set(b.category, b.limit));
        const categories = new Set([
            ...spendingComparison.map((s) => s._id.category),
            ...Object.keys(defaultBudgets),
        ]);
        const monthlyByCategory = Array.from(categories).map((cat) => {
            const spentSoFar = spendingComparison.find((s) => s._id.category === cat && s._id.isCurrentMonth)?.total || 0;
            const lastMonth = spendingComparison.find((s) => s._id.category === cat && !s._id.isCurrentMonth)?.total || 0;
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
                overspendBy,
            };
        });
        const insightPayload = {
            today: todayStr,
            daysElapsed,
            daysInMonth,
            thisWeek: thisWeekData,
            monthlyByCategory,
        };
        // 4. Call Gemini AI
        const insight = await generateNaturalLanguageInsight(insightPayload);
        return res.status(200).json({ insight });
    }
    catch (error) {
        console.error("❌ AI New Insights Error:", error);
        return res.status(502).json({
            message: "Failed to generate natural language AI insight from Gemini",
            error: error.message || String(error),
        });
    }
};
//# sourceMappingURL=aiController.js.map