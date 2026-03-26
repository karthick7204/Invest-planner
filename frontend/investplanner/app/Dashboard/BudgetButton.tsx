"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export function BudgetButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [budgetType, setBudgetType] = useState("monthly");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Budget set:", { type: budgetType, amount });
    setIsOpen(false);
    // You can integrate API call here in the future
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-700 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-gray-800 transition"
      >
        <Plus size={18} />
        Set Budget
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-50">
          <h3 className="font-semibold text-gray-800 mb-4 text-lg">Set New Budget</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Duration</label>
              <select 
                value={budgetType} 
                onChange={(e) => setBudgetType(e.target.value)}
                className="w-full text-black bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="monthly" className="text-black">Monthly</option>
                <option value="yearly"  className="text-black"  >Yearly</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Amount</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-black font-medium">₹</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-black bg-gray-50 border border-gray-200 rounded-lg p-2.5 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="mt-3 w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition text-sm font-medium shadow-md"
            >
              Save Budget
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
