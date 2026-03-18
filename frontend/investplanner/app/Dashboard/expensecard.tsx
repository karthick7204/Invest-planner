import { ArrowDown} from "lucide-react";

export function ExpenseCard() {
  return (
    <div className="w-90 h-38  bg-white rounded-lg shadow-md p-4">
      <h2 className="text-md font-semibold text-mauve-400">Expenses</h2>
      <p className="text-2xl font-bold text-black">₹2,000</p>
        <div className='w-10 h-10 mt-2 rounded-full bg-red-100 flex items-center justify-center cursor-pointer hover:bg-red-200 transition'>
      <ArrowDown size={20} className="text-red-600" />
      </div>   
    </div>
  )
}