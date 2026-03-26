import { CashFlowGraph } from "./cashFlowGraph";
import { ExpenseCard } from "./expensecard";
import IncomeCard from "./incomecard";
import RecentTransaction from "./recentTransactions";
import { SurplusCard } from "./surplusCard";

import { BudgetButton } from "./BudgetButton";

export default function DashboardPage() {
  return (
    <div className="absolute bg-[#f6f7f6]  top-12 left-52 flex flex-col items-start justify-start gap-4 p-4 w-[calc(100%-15rem)]">
      <div className="flex w-full justify-between items-center">
        <div>
          <h1 className="font-bold text-black text-3xl">Financial Overview</h1>
          <p className="font-light text-mauve-500">Welcome back name,Here's what's new happening with you money</p>
        </div>
        <BudgetButton />
      </div>
      <div className="flex flex-row gap-16">
         <IncomeCard />
         <ExpenseCard />
         <SurplusCard />
      </div>
      <CashFlowGraph />
      <RecentTransaction />
    </div>
  )
}