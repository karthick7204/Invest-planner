import {  Wallet} from "lucide-react";
export function SurplusCard() {
  return (
    <div className="w-90 h-38 bg-yellow-300 rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-black">Surplus</h2>
      <p className="text-2xl font-bold text-black">₹3,000</p>
        <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer hover:bg-blue-200 transition' title="Surplus">
        <Wallet size={20} className="text-blue-600" />
        </div>
    </div>
  )
}