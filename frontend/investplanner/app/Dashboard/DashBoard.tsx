import { CashFlowGraph } from "./cashFlowGraph";
import { ExpenseCard } from "./expensecard";
import IncomeCard from "./incomecard";
import RecentTransaction from "./recentTransactions";
import { SurplusCard } from "./surplusCard";

export default function DashboardPage() {
  return (
    <div className="absolute top-12 left-52 flex flex-col items-start justify-start gap-4 p-4">
      <h1 className="font-bold text-3xl">Financial Overview</h1>
      <p className="font-light">Welcome back name,Here's what's new happening with you money</p>
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