import { CashFlowGraph } from "./cashFlowGraph";
import { ExpenseCard } from "./expensecard";
import IncomeCard from "./incomecard";
import RecentTransaction from "./recentTransactions";
import { SurplusCard } from "./surplusCard";
import { BudgetButton } from "./BudgetButton";
import { BudgetStatus } from "./BudgetStatus";

export default function DashboardPage() {
  return (
    <div className="w-full flex flex-col items-start justify-start gap-6 pb-8">
      <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-bold text-black text-2xl md:text-3xl tracking-tight">Financial Overview</h1>
          <p className="font-light text-mauve-500 text-sm md:text-base mt-1">Welcome back, Here's what's new happening with your money</p>
        </div>
        <div className="w-full sm:w-auto self-start sm:self-auto flex sm:justify-end shrink-0">
          <BudgetButton />
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
         <IncomeCard />
         <ExpenseCard/>
         <SurplusCard />
      </div>

      <BudgetStatus />
      
      <div className="w-full">
        <CashFlowGraph />
      </div>
      
      <div className="w-full">
        <RecentTransaction />
      </div>
    </div>
  )
}