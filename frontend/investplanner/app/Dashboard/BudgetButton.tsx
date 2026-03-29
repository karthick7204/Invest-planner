"use client";

import { useState } from "react";
import { Plus, X, Check, Loader2 } from "lucide-react";
import { apiCall } from "../lib/api";

export function BudgetButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("General");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Format current month as YYYY-MM
      const currentMonth = new Date().toISOString().substring(0, 7);
      
      await apiCall("/budget/set", {
        method: "POST",
        body: JSON.stringify({
          category,
          limit: Number(amount),
          month: currentMonth
        }),
      });

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setAmount("");
        // Notify other components to refresh if needed
        window.dispatchEvent(new Event('budgetUpdated'));
      }, 1500);
    } catch (error) {
      console.error("Failed to set budget:", error);
      alert("Error saving budget. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["General", "Food", "Transport", "Rent", "Groceries", "Entertainment", "Shopping", "Utilities", "Healthcare"];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-slate-800 active:scale-95 transition-all font-medium text-sm"
      >
        <Plus size={18} />
        Set Budget
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-50 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Define Budget</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Monthly Limit</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 pl-8 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || success}
              className={`mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm shadow-md ${
                success 
                ? "bg-green-500 text-white" 
                : "bg-amber-500 text-white hover:bg-amber-600 active:scale-95 disabled:opacity-70"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : success ? <Check size={18} /> : "Save Budget Goal"}
            </button>
          </form>
          
          <p className="mt-4 text-[10px] text-center text-slate-400 font-medium">
            This budget will apply to {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      )}
    </div>
  );
}
