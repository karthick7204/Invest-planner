import IncomeExpensesChart from "../components/graphChart";

export function CashFlowGraph() {
  return (
    <div className="w-full h-lvh bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold mb-4 text-black">Cash Flow Analysis</h2>
      <p className="text-md text-mauve-500">visualizing your financial health over time</p>
      
      <div className="absolute top- w-full  rounded-lg flex items-center justify-center">
       <IncomeExpensesChart/>
      </div>
    </div>
  )
}