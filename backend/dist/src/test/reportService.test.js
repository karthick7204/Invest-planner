import { describe, it } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { calculateFinancialMetrics, } from "../service/financialReportService.js";
import { validateAIInsightResponseStrict, validateAIInsightResponse, extractAndParseJSON, } from "../service/geminiService.js";
import { getAIInsights, getFinancialReport } from "../controllers/aiController.js";
describe("Financial Metrics Calculations", () => {
    it("accurately calculates total income, total expenses, and positive surplus", () => {
        const records = {
            incomes: [
                { amount: 50000, category: "Salary", purpose: "Monthly Salary" },
                { amount: 15000, category: "Freelance", purpose: "Client project" },
            ],
            expenses: [
                { amount: 12000, category: "Rent", purpose: "Apartment" },
                { amount: 6000, category: "Food", purpose: "Groceries" },
                { amount: 2000, category: "Transport", purpose: "Metro" },
            ],
            transactions: [],
            budgets: [],
        };
        const metrics = calculateFinancialMetrics(records);
        assert.equal(metrics.totalIncome, 65000);
        assert.equal(metrics.totalExpenses, 20000);
        assert.equal(metrics.netSurplus, 45000);
        // savingsRatio = (45000 / 65000) * 100 = 69.2%
        assert.equal(metrics.savingsRatio, 69.2);
        // expenseRatio = (20000 / 65000) * 100 = 30.8%
        assert.equal(metrics.expenseRatio, 30.8);
        assert.equal(metrics.netWorthVelocity, "Accelerating");
    });
    it("handles deficit / overspending correctly with negative surplus and Retracting velocity", () => {
        const records = {
            incomes: [{ amount: 30000, category: "Salary", purpose: "Salary" }],
            expenses: [
                { amount: 25000, category: "Rent", purpose: "Rent" },
                { amount: 10000, category: "Shopping", purpose: "Electronics" },
            ],
            transactions: [],
            budgets: [],
        };
        const metrics = calculateFinancialMetrics(records);
        assert.equal(metrics.totalIncome, 30000);
        assert.equal(metrics.totalExpenses, 35000);
        assert.equal(metrics.netSurplus, -5000);
        assert.equal(metrics.savingsRatio, -16.7);
        assert.equal(metrics.netWorthVelocity, "Retracting");
        assert.ok(metrics.healthScore < 50, `Health score should be penalized for deficit: ${metrics.healthScore}`);
    });
    it("handles zero income gracefully without division by zero", () => {
        const records = {
            incomes: [],
            expenses: [{ amount: 5000, category: "Food", purpose: "Dinner" }],
            transactions: [],
            budgets: [],
        };
        const metrics = calculateFinancialMetrics(records);
        assert.equal(metrics.totalIncome, 0);
        assert.equal(metrics.totalExpenses, 5000);
        assert.equal(metrics.netSurplus, -5000);
        assert.equal(metrics.savingsRatio, 0);
        assert.equal(metrics.expenseRatio, 0);
        assert.equal(metrics.netWorthVelocity, "Retracting");
    });
    it("correctly groups category expenses and calculates percentage of total and income", () => {
        const records = {
            incomes: [{ amount: 100000, category: "Salary", purpose: "Job" }],
            expenses: [
                { amount: 30000, category: "Rent", purpose: "Apartment" },
                { amount: 15000, category: "Food", purpose: "Groceries" },
                { amount: 5000, category: "Food", purpose: "Dining" },
                { amount: 10000, category: "Travel", purpose: "Weekend trip" },
            ],
            transactions: [],
            budgets: [],
        };
        const metrics = calculateFinancialMetrics(records);
        assert.equal(metrics.categoryExpenses.length, 3);
        // Highest category first
        assert.equal(metrics.categoryExpenses[0]?.category, "Rent");
        assert.equal(metrics.categoryExpenses[0]?.amount, 30000);
        assert.equal(metrics.categoryExpenses[0]?.percentageOfTotal, 50); // 30000 / 60000 = 50%
        // Food should aggregate 15000 + 5000 = 20000
        const food = metrics.categoryExpenses.find((c) => c.category === "Food");
        assert.ok(food);
        assert.equal(food.amount, 20000);
        assert.equal(food.percentageOfTotal, 33.3);
    });
    it("detects investment expenses, calculates investable surplus and 50/30/20 portfolio split", () => {
        const records = {
            incomes: [{ amount: 100000, category: "Salary", purpose: "Monthly" }],
            expenses: [
                { amount: 30000, category: "Rent", purpose: "Rent" },
                { amount: 10000, category: "Mutual Funds", purpose: "Monthly SIP" },
                { amount: 5000, category: "Stock Market", purpose: "NIFTY ETF" },
            ],
            transactions: [],
            budgets: [],
        };
        const metrics = calculateFinancialMetrics(records);
        // Total actual investments detected = 10000 + 5000 = 15000
        assert.equal(metrics.investments.totalActualInvested, 15000);
        assert.equal(metrics.investments.investmentRatio, 15);
        // Total surplus = 100000 - 45000 = 55000
        assert.equal(metrics.netSurplus, 55000);
        assert.equal(metrics.investments.investableSurplus, 55000);
        // 50% Stocks, 30% Mutual Funds, 20% Gold
        assert.equal(metrics.investments.suggestedSplit.for_Stocks, 27500);
        assert.equal(metrics.investments.suggestedSplit.for_Mutualfunds, 16500);
        assert.equal(metrics.investments.suggestedSplit.for_Gold, 11000);
    });
    it("accurately tracks budget limits vs spending and identifies overspent categories", () => {
        const records = {
            incomes: [{ amount: 80000, category: "Salary", purpose: "Salary" }],
            expenses: [
                { amount: 12000, category: "Food", purpose: "Dining" },
                { amount: 4000, category: "Entertainment", purpose: "Movies" },
                { amount: 3000, category: "Transport", purpose: "Fuel" },
            ],
            transactions: [],
            budgets: [
                { category: "Food", limit: 10000, month: "2026-10" }, // Over by 2000
                { category: "Entertainment", limit: 5000, month: "2026-10" }, // Under budget
                { category: "Transport", limit: 3000, month: "2026-10" }, // Exact match
            ],
        };
        const metrics = calculateFinancialMetrics(records);
        assert.equal(metrics.budgetMetrics.totalBudgetLimit, 18000);
        assert.equal(metrics.budgetMetrics.totalBudgetSpent, 19000);
        assert.deepEqual(metrics.budgetMetrics.overspentCategories, ["Food"]);
        const foodBudget = metrics.budgetMetrics.budgets.find((b) => b.category === "Food");
        assert.ok(foodBudget);
        assert.equal(foodBudget.isOverBudget, true);
        assert.equal(foodBudget.overspendAmount, 2000);
        assert.equal(foodBudget.remaining, 0);
        const entertainmentBudget = metrics.budgetMetrics.budgets.find((b) => b.category === "Entertainment");
        assert.ok(entertainmentBudget);
        assert.equal(entertainmentBudget.isOverBudget, false);
        assert.equal(entertainmentBudget.remaining, 1000);
    });
});
describe("User Isolation and Security", () => {
    it("strictly prevents User A from accessing User B data via route parameters with 403 Forbidden", async () => {
        const userA_Id = new mongoose.Types.ObjectId().toString();
        const userB_Id = new mongoose.Types.ObjectId().toString();
        let statusCode = 0;
        let responseBody = null;
        const mockReq = {
            userId: userA_Id, // Authenticated as User A
            params: {
                userId: userB_Id, // Attempting to request User B
            },
        };
        const mockRes = {
            status(code) {
                statusCode = code;
                return this;
            },
            json(body) {
                responseBody = body;
                return this;
            },
        };
        await getAIInsights(mockReq, mockRes);
        assert.equal(statusCode, 403, "Should return 403 Forbidden for mismatched userId");
        assert.match(responseBody?.message, /cannot access another user's financial data/i, "Should return clear security isolation message");
    });
    it("returns 401 Unauthorized when request has missing or invalid auth token", async () => {
        let statusCode = 0;
        let responseBody = null;
        const mockReq = {
            userId: undefined, // No user authenticated
            params: {},
        };
        const mockRes = {
            status(code) {
                statusCode = code;
                return this;
            },
            json(body) {
                responseBody = body;
                return this;
            },
        };
        await getFinancialReport(mockReq, mockRes);
        assert.equal(statusCode, 401, "Should return 401 Unauthorized when userId is missing");
    });
    it("isolates data: calculations on User A records never leak User B data", () => {
        const userA_records = {
            incomes: [{ amount: 50000, category: "Salary" }],
            expenses: [{ amount: 20000, category: "Rent" }],
            transactions: [],
            budgets: [],
        };
        const userB_records = {
            incomes: [{ amount: 200000, category: "Business" }],
            expenses: [{ amount: 80000, category: "Luxury" }],
            transactions: [],
            budgets: [],
        };
        const metricsA = calculateFinancialMetrics(userA_records);
        const metricsB = calculateFinancialMetrics(userB_records);
        assert.equal(metricsA.totalIncome, 50000);
        assert.equal(metricsA.totalExpenses, 20000);
        assert.equal(metricsB.totalIncome, 200000);
        assert.equal(metricsB.totalExpenses, 80000);
        assert.notEqual(metricsA.totalIncome, metricsB.totalIncome);
    });
});
describe("AI Failure Handling & Strict JSON Validation", () => {
    it("validates and accepts valid AIInsightResponseStrict JSON", () => {
        const validData = {
            title: "Comprehensive Wealth Audit",
            insights: [
                "Your savings rate is strong at 35%.",
                "Rent is your highest expense category at 40% of cash outflow.",
            ],
            suggestions: [
                "Cap dining expenses at ₹5,000 monthly.",
                "Automate an emergency fund SIP.",
            ],
            investmentAdvice: [
                "Allocate 50% of monthly surplus into low-cost index funds.",
            ],
        };
        const result = validateAIInsightResponseStrict(validData);
        assert.equal(result.title, "Comprehensive Wealth Audit");
        assert.equal(result.insights.length, 2);
        assert.equal(result.suggestions.length, 2);
        assert.equal(result.investmentAdvice.length, 1);
    });
    it("rejects non-object or null AI responses without silent fallback", () => {
        assert.throws(() => validateAIInsightResponseStrict(null), /AI response must be a JSON object/);
        assert.throws(() => validateAIInsightResponseStrict("string response"), /AI response must be a JSON object/);
    });
    it("rejects responses missing required title string", () => {
        const invalid = {
            title: "   ",
            insights: ["Good"],
            suggestions: ["Save"],
            investmentAdvice: ["Invest"],
        };
        assert.throws(() => validateAIInsightResponseStrict(invalid), /missing a valid non-empty 'title'/);
    });
    it("rejects responses with empty or invalid insights array", () => {
        const invalid = {
            title: "Report",
            insights: [], // Empty!
            suggestions: ["Save"],
            investmentAdvice: ["Invest"],
        };
        assert.throws(() => validateAIInsightResponseStrict(invalid), /must contain an 'insights' array with at least 1 item/);
    });
    it("extractAndParseJSON parses markdown-wrapped JSON properly and rejects invalid strings", () => {
        const wrapped = `
      Here is your financial report:
      \`\`\`json
      {
        "title": "Monthly Audit",
        "insights": ["Insight 1"],
        "suggestions": ["Suggestion 1"],
        "investmentAdvice": ["Advice 1"]
      }
      \`\`\`
    `;
        const parsed = extractAndParseJSON(wrapped);
        assert.equal(parsed.title, "Monthly Audit");
        assert.equal(parsed.insights[0], "Insight 1");
        // Invalid non-JSON
        assert.throws(() => extractAndParseJSON("Sorry, I cannot help with that."), /Unable to find valid JSON object boundaries/);
    });
    it("validates AIInsightResponse metrics and item fields strictly", () => {
        const valid = {
            insights: [
                {
                    title: "High Savings",
                    description: "You saved 40% of income.",
                    icon: "TrendingUp",
                    tag: "Positive",
                    color: "bg-green-50",
                },
            ],
            metrics: {
                healthScore: 85,
                savingsRatio: 40,
                netWorthVelocity: "Accelerating",
            },
        };
        const validated = validateAIInsightResponse(valid);
        assert.equal(validated.metrics.healthScore, 85);
        assert.equal(validated.insights[0]?.title, "High Savings");
        // Missing numeric health score
        const invalid = {
            insights: [{ title: "T", description: "D" }],
            metrics: { healthScore: "NotANumber", savingsRatio: 10 },
        };
        assert.throws(() => validateAIInsightResponse(invalid), /must be a valid number/);
    });
});
//# sourceMappingURL=reportService.test.js.map