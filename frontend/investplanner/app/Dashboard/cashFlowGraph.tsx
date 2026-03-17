import IncomeExpensesChart from "../components/graphChart";

export function CashFlowGraph() {
  return (
    <div className="w-full h-lvh bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold mb-4">Cash Flow Analysis</h2>
      
      <div className="absolute top- w-full  rounded-lg flex items-center justify-center">
       <IncomeExpensesChart/>
      </div>
    </div>
  )
}