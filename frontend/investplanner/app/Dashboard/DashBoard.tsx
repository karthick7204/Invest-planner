'use client';

import { CashFlowGraph } from './cashFlowGraph';
import { ExpenseCard } from './expensecard';
import IncomeCard from './incomecard';
import RecentTransaction from './recentTransactions';
import { SurplusCard } from './surplusCard';
import { BudgetButton } from './BudgetButton';
import { BudgetStatus } from './BudgetStatus';

export default function DashboardPage() {
  return (
    <div className="w-full flex flex-col items-start justify-start gap-6 pb-12 max-w-6xl mx-auto">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4 pb-2 border-b border-neutral-200/60">
        <div>
          <h1 className="font-bold text-neutral-950 text-2xl sm:text-3xl tracking-tight">
            Financial Overview
          </h1>
          <p className="font-normal text-neutral-500 text-xs sm:text-sm mt-1">
            Real-time balance velocity and capital allocation overview
          </p>
        </div>
        <div className="w-full sm:w-auto flex justify-end shrink-0">
          <BudgetButton />
        </div>
      </div>

      {/* 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
        <IncomeCard />
        <ExpenseCard />
        <SurplusCard />
      </div>

      {/* Budget Progress */}
      <BudgetStatus />

      {/* Trajectory / Statistics Chart */}
      <div className="w-full">
        <CashFlowGraph />
      </div>

      {/* Extracted Recent Ledger Table */}
      <div className="w-full">
        <RecentTransaction />
      </div>
    </div>
  );
}