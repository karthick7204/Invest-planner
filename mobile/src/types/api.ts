export interface User {
  _id?: string;
  userId?: string;
  username: string;
  email: string;
}

export interface Transaction {
  _id?: string;
  id?: string;
  user?: string;
  type: 'expense' | 'income';
  topic: string;
  category: string;
  amount: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  _id: string;
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  isExceeded: boolean;
  additionalIds?: string[];
}

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
  netWorthVelocity: 'Accelerating' | 'Stable' | 'Retracting';
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

export interface AIReportData {
  report: {
    title: string;
    generatedAt: string;
    healthScore: number;
    savingsRatio: number;
    netWorthVelocity: 'Accelerating' | 'Stable' | 'Retracting';
    insights: string[];
    suggestions: string[];
    investmentAdvice: string[];
  };
  metrics: FinancialMetrics;
  summary: {
    incomeCount: number;
    expenseCount: number;
    transactionCount: number;
    budgetCount: number;
  };
}

export interface AIInsightResult {
  title?: string;
  insights: string[];
  suggestions: string[];
  investmentAdvice: string[];
  metrics?: {
    salary: number;
    total_expenses: number;
    category_expenses: { category: string; amount: number }[];
    investments: number;
    surplus: number;
  };
  calculatedMetrics?: FinancialMetrics;
}

export interface Stock {
  symbol: string;
  lastprice: number;
}
