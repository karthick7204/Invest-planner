import mongoose from 'mongoose';
import { expense } from '../models/expenseModel.js';
import { totalIncomeAmount } from '../service/totalIncome.js';
import { totalExpenseAmount } from '../service/totalExpense.js';
import { generateAIInsightsStrict } from '../service/geminiService.js';
export const getAIInsights = async (req, res) => {
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
    }
    catch (error) {
        console.error("❌ AI Insights Error:", error);
        return res.status(500).json({
            message: "Internal Server Error in Wealth AI module",
            error: error.message
        });
    }
};
//# sourceMappingURL=aiController.js.map