import mongoose from "mongoose";
import { income } from "../models/incomeModel.js";
import { expense } from "../models/expenseModel.js";
import { transaction } from "../models/transactionModel.js";
import { budget } from "../models/budgetModel.js";
import { splitUpCalculation } from "./splitUpCalculation.js";

export interface CategoryExpenseMetric {
  category: string;
  amount: number;
  percentageOfTotal: number;
  percentageOfIncome: number;
}

export interface BudgetPerformanceMetric {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  isOverBudget: boolean;
  overspendAmount: number;
  utilizationPercent: number;
}

export interface InvestmentMetrics {
  totalActualInvested: number;
  investableSurplus: number;
  suggestedSplit: {
    for_Stocks: number;
    for_Mutualfunds: number;
    for_Gold: number;
  };
  investmentRatio: number;
}

export interface FinancialMetrics {
  totalIncome: number;
  totalExpenses: number;
  netSurplus: number;
  savingsRatio: number;
  expenseRatio: number;
  healthScore: number;
  netWorthVelocity: "Accelerating" | "Stable" | "Retracting";
  categoryExpenses: CategoryExpenseMetric[];
  investments: InvestmentMetrics;
  budgetMetrics: {
    totalBudgetLimit: number;
    totalBudgetSpent: number;
    overallUtilizationPercent: number;
    overspentCategories: string[];
    budgets: BudgetPerformanceMetric[];
  };
}

export interface UserFinancialRecords {
  incomes: any[];
  expenses: any[];
  transactions: any[];
  budgets: any[];
}

export interface CalculatedFinancialData {
  metrics: FinancialMetrics;
  dataStr: string;
  rawSummary: {
    incomeCount: number;
    expenseCount: number;
    transactionCount: number;
    budgetCount: number;
  };
}

// Regular expression to identify investment-related categories or transaction purposes
export const INVESTMENT_CATEGORY_REGEX = /invest|stock|mutual\s*fund|crypto|gold|equity|deposit|sip|securities|bonds|etf/i;

/**
 * Accurately calculate all financial metrics from user records.
 * Pure function suitable for deterministic unit testing.
 */
export const calculateFinancialMetrics = (records: UserFinancialRecords): FinancialMetrics => {
  const { incomes, expenses, transactions, budgets } = records;

  // 1. Total Income
  const totalIncome = incomes.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // 2. Total Expenses
  const totalExpenses = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // 3. Net Surplus
  const netSurplus = totalIncome - totalExpenses;

  // 4. Savings Ratio (percentage of income saved, 0 if totalIncome <= 0)
  const savingsRatio = totalIncome > 0 ? Number(((netSurplus / totalIncome) * 100).toFixed(1)) : 0;

  // 5. Expense Ratio (percentage of income spent)
  const expenseRatio = totalIncome > 0 ? Number(((totalExpenses / totalIncome) * 100).toFixed(1)) : 0;

  // 6. Category Expenses Breakdown
  const categoryMap = new Map<string, number>();
  for (const exp of expenses) {
    const cat = (exp.category || "Other").trim();
    const amt = Number(exp.amount) || 0;
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + amt);
  }

  const categoryExpenses: CategoryExpenseMetric[] = Array.from(categoryMap.entries())
    .map(([category, amount]) => {
      const percentageOfTotal = totalExpenses > 0 ? Number(((amount / totalExpenses) * 100).toFixed(1)) : 0;
      const percentageOfIncome = totalIncome > 0 ? Number(((amount / totalIncome) * 100).toFixed(1)) : 0;
      return {
        category,
        amount,
        percentageOfTotal,
        percentageOfIncome,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // 7. Investment Calculations
  // Find actual investment expenses
  let totalActualInvested = 0;
  for (const exp of expenses) {
    const cat = exp.category || "";
    const purp = exp.purpose || "";
    if (INVESTMENT_CATEGORY_REGEX.test(cat) || INVESTMENT_CATEGORY_REGEX.test(purp)) {
      totalActualInvested += Number(exp.amount) || 0;
    }
  }

  // Also check transactions if expenses didn't catch them
  if (totalActualInvested === 0 && transactions && transactions.length > 0) {
    for (const t of transactions) {
      if (t.type === "expense" && (INVESTMENT_CATEGORY_REGEX.test(t.category || "") || INVESTMENT_CATEGORY_REGEX.test(t.topic || ""))) {
        totalActualInvested += Number(t.amount) || 0;
      }
    }
  }

  const investableSurplus = Math.max(0, netSurplus);
  // Reusing existing splitUpCalculation(stocks: 50, mutualfunds: 30, gold: 20)
  const suggestedSplit = splitUpCalculation(50, 30, 20, investableSurplus);
  const investmentRatio = totalIncome > 0 ? Number(((totalActualInvested / totalIncome) * 100).toFixed(1)) : 0;

  const investments: InvestmentMetrics = {
    totalActualInvested,
    investableSurplus,
    suggestedSplit,
    investmentRatio,
  };

  // 8. Budget Metrics & Adherence
  const budgetPerformance: BudgetPerformanceMetric[] = budgets.map((b) => {
    const cat = (b.category || "").trim();
    const limit = Number(b.limit) || 0;
    // Calculate total spent in this budget category across recorded expenses
    const spent = expenses
      .filter((exp) => (exp.category || "").trim().toLowerCase() === cat.toLowerCase())
      .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

    const remaining = Math.max(0, limit - spent);
    const isOverBudget = spent > limit;
    const overspendAmount = isOverBudget ? spent - limit : 0;
    const utilizationPercent = limit > 0 ? Number(((spent / limit) * 100).toFixed(1)) : 0;

    return {
      category: cat,
      limit,
      spent,
      remaining,
      isOverBudget,
      overspendAmount,
      utilizationPercent,
    };
  });

  const totalBudgetLimit = budgets.reduce((sum, b) => sum + (Number(b.limit) || 0), 0);
  const totalBudgetSpent = budgetPerformance.reduce((sum, b) => sum + b.spent, 0);
  const overallUtilizationPercent = totalBudgetLimit > 0 ? Number(((totalBudgetSpent / totalBudgetLimit) * 100).toFixed(1)) : 0;
  const overspentCategories = budgetPerformance.filter((b) => b.isOverBudget).map((b) => b.category);

  // 9. Financial Health Score (0 - 100 scale)
  // Multi-pillar scoring model:
  // - Savings Pillar (40 pts max):
  //     savingsRatio >= 30% -> 40 pts
  //     savingsRatio >= 20% -> 35 pts
  //     savingsRatio >= 10% -> 25 pts
  //     savingsRatio >= 0%  -> 15 pts
  //     savingsRatio < 0%   -> 0 pts (living on debt/depleting reserves)
  // - Expense Control Pillar (30 pts max):
  //     expenseRatio <= 50% -> 30 pts
  //     expenseRatio <= 70% -> 22 pts
  //     expenseRatio <= 90% -> 12 pts
  //     expenseRatio <= 100% -> 5 pts
  //     expenseRatio > 100% -> 0 pts
  // - Budget Adherence Pillar (20 pts max):
  //     if budgets defined:
  //       0 overspent budgets -> 20 pts
  //       1 overspent budget -> 10 pts
  //       2+ overspent budgets -> 0 pts
  //     if no budgets defined:
  //       if netSurplus >= 0 -> 15 pts (positive cashflow baseline)
  //       else -> 0 pts
  // - Capital Growth Pillar (10 pts max):
  //     totalActualInvested > 0 or investableSurplus > 0 -> 10 pts
  //     else -> 0 pts
  let healthScore = 0;

  // Savings score
  if (savingsRatio >= 30) healthScore += 40;
  else if (savingsRatio >= 20) healthScore += 35;
  else if (savingsRatio >= 10) healthScore += 25;
  else if (savingsRatio >= 0 && totalIncome > 0) healthScore += 15;

  // Expense control score
  if (expenseRatio <= 50 && totalIncome > 0) healthScore += 30;
  else if (expenseRatio <= 70 && totalIncome > 0) healthScore += 22;
  else if (expenseRatio <= 90 && totalIncome > 0) healthScore += 12;
  else if (expenseRatio <= 100 && totalIncome > 0) healthScore += 5;

  // Budget adherence score
  if (budgets.length > 0) {
    if (overspentCategories.length === 0) healthScore += 20;
    else if (overspentCategories.length === 1) healthScore += 10;
  } else {
    if (netSurplus >= 0 && totalIncome > 0) healthScore += 15;
  }

  // Capital growth score
  if (totalActualInvested > 0 || (investableSurplus > 0 && totalIncome > 0)) {
    healthScore += 10;
  }

  // Clamp health score between 0 and 100
  healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

  // 10. Net Worth Velocity
  let netWorthVelocity: "Accelerating" | "Stable" | "Retracting";
  if (savingsRatio >= 20) {
    netWorthVelocity = "Accelerating";
  } else if (netSurplus >= 0 && totalIncome > 0) {
    netWorthVelocity = "Stable";
  } else {
    netWorthVelocity = "Retracting";
  }

  return {
    totalIncome,
    totalExpenses,
    netSurplus,
    savingsRatio,
    expenseRatio,
    healthScore,
    netWorthVelocity,
    categoryExpenses,
    investments,
    budgetMetrics: {
      totalBudgetLimit,
      totalBudgetSpent,
      overallUtilizationPercent,
      overspentCategories,
      budgets: budgetPerformance,
    },
  };
};

/**
 * Fetch authenticated user's financial records from MongoDB using the verified userId.
 * Strictly isolates queries to the authenticated user.
 */
export const fetchUserFinancialData = async (userId: string): Promise<CalculatedFinancialData> => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid or missing User ID");
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Fetch actual user data across all existing MongoDB models concurrently
  const [userIncomes, userExpenses, userTransactions, userBudgets] = await Promise.all([
    income.find({ user: userObjectId }).sort({ date: -1 }).lean(),
    expense.find({ user: userObjectId }).sort({ date: -1 }).lean(),
    transaction.find({ user: userObjectId }).sort({ date: -1 }).limit(100).lean(),
    budget.find({ user: userObjectId }).lean(),
  ]);

  const rawRecords: UserFinancialRecords = {
    incomes: userIncomes,
    expenses: userExpenses,
    transactions: userTransactions,
    budgets: userBudgets,
  };

  const metrics = calculateFinancialMetrics(rawRecords);

  // Build a concise, informative text summary of transactions & financial profile for Gemini
  const transactionLines = userTransactions.slice(0, 30).map((t: any) => {
    const dateObj = t.date ? new Date(t.date) : new Date();
    const dateStr = !isNaN(dateObj.getTime()) ? dateObj.toISOString().split("T")[0] : "Recent";
    return `- ${dateStr}: ${t.type || "transaction"} ₹${t.amount || 0} on ${t.category || "General"} (${t.topic || "N/A"})`;
  });

  const categoryLines = metrics.categoryExpenses.map(
    (c) => `- ${c.category}: ₹${c.amount} (${c.percentageOfTotal}% of expenses)`
  );

  const budgetLines = metrics.budgetMetrics.budgets.map(
    (b) => `- ${b.category}: Limit ₹${b.limit}, Spent ₹${b.spent} (${b.isOverBudget ? "OVER BUDGET" : "Within budget"})`
  );

  const dataStr = `
User Financial Summary:
- Total Income: ₹${metrics.totalIncome}
- Total Expenses: ₹${metrics.totalExpenses}
- Net Surplus: ₹${metrics.netSurplus}
- Savings Ratio: ${metrics.savingsRatio}%
- Actual Investments: ₹${metrics.investments.totalActualInvested}
- Financial Health Score: ${metrics.healthScore}/100
- Velocity: ${metrics.netWorthVelocity}

Top Spending Categories:
${categoryLines.length > 0 ? categoryLines.join("\n") : "None recorded"}

Budget Status:
${budgetLines.length > 0 ? budgetLines.join("\n") : "No budgets set"}

Recent Transactions:
${transactionLines.length > 0 ? transactionLines.join("\n") : "No transactions recorded"}
`.trim();

  return {
    metrics,
    dataStr,
    rawSummary: {
      incomeCount: userIncomes.length,
      expenseCount: userExpenses.length,
      transactionCount: userTransactions.length,
      budgetCount: userBudgets.length,
    },
  };
};
