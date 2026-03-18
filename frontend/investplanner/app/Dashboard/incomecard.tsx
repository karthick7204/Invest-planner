import { ArrowUp} from 'lucide-react';

export default function IncomeCard() {
  return (
    <div className="w-90 h-38 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-md font-semibold text-mauve-400">Income</h2>
      <p className="text-2xl font-bold text-black">₹5,000</p>
      <div className='w-10 h-10 mt-2 rounded-full bg-green-100 flex items-center justify-center cursor-pointer hover:bg-green-200 transition'>
      <ArrowUp size={20} className="text-green-600" />
      </div>    
      </div>
  )
}