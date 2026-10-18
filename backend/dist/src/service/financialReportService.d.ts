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
export declare const INVESTMENT_CATEGORY_REGEX: RegExp;
/**
 * Accurately calculate all financial metrics from user records.
 * Pure function suitable for deterministic unit testing.
 */
export declare const calculateFinancialMetrics: (records: UserFinancialRecords) => FinancialMetrics;
/**
 * Fetch authenticated user's financial records from MongoDB using the verified userId.
 * Strictly isolates queries to the authenticated user.
 */
export declare const fetchUserFinancialData: (userId: string) => Promise<CalculatedFinancialData>;
//# sourceMappingURL=financialReportService.d.ts.map