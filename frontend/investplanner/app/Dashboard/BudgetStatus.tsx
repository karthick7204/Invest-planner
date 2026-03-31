"use client";

import { useState, useEffect } from "react";
import { apiCall } from "../lib/api";
import { Target, AlertCircle, CheckCircle2, MoreHorizontal, Trash2 } from "lucide-react";

interface Budget {
  _id: string;
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  isExceeded: boolean;
}

export function BudgetStatus() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchBudgets = async () => {
    try {
      const month = new Date().toISOString().substring(0, 7);
      const data = await apiCall(`/budget?month=${month}`);
      if (data && data.budgets) {
        setBudgets(data.budgets);
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (budgetId: string) => {
    if (confirmDeleteId !== budgetId) {
      setConfirmDeleteId(budgetId);
      // Auto-reset after 3 seconds if not confirmed
      setTimeout(() => setConfirmDeleteId(null), 3000);
      return;
    }
    
    setConfirmDeleteId(null);
    setDeletingId(budgetId);
    try {
      await apiCall(`/budget/${budgetId}`, {
        method: 'DELETE'
      });
      // Update local state
      setBudgets(budgets.filter(b => b._id !== budgetId));
      // Notify other components (like the graph)
      window.dispatchEvent(new Event('budgetUpdated'));
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert("Failed to delete budget");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchBudgets();

    // Listen for budget updates
    const handleUpdate = () => fetchBudgets();
    window.addEventListener('budgetUpdated', handleUpdate);
    window.addEventListener('transactionAdded', handleUpdate); // Also refresh when spending changes

    return () => {
      window.removeEventListener('budgetUpdated', handleUpdate);
      window.removeEventListener('transactionAdded', handleUpdate);
    };
  }, []);

  if (loading) return null;
  if (budgets.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 p-2.5 rounded-2xl text-amber-600">
            <Target size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Budget Progress</h3>
            <p className="text-xs text-slate-400 font-medium">Monthly spending limits</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const percent = Math.min(100, (budget.spent / budget.limit) * 100);
          const isWarning = percent > 80 && percent <= 100;
          const isDanger = budget.isExceeded;

          return (
            <div key={budget._id} className="relative flex flex-col gap-3 group p-2 rounded-2xl hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-sm flex items-center gap-2">
                  {budget.category}
                  {isDanger && <AlertCircle size={14} className="text-rose-500 animate-pulse" />}
                  {!isDanger && percent > 90 && <AlertCircle size={14} className="text-amber-500" />}
                </span>
                
                {/* Modern "Double-Click" Confirmation Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(budget._id);
                  }}
                  disabled={deletingId === budget._id}
                  className={`transition-all duration-300 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold 
                    ${confirmDeleteId === budget._id 
                      ? "bg-rose-500 text-white shadow-sm ring-2 ring-rose-200" 
                      : "opacity-0 group-hover:opacity-100 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                    } ${deletingId === budget._id ? "opacity-100 bg-slate-100 cursor-not-allowed" : ""}`}
                  title={confirmDeleteId === budget._id ? "Confirm Deletion" : "Delete Budget"}
                >
                  {confirmDeleteId === budget._id ? (
                    <span className="text-[11px] uppercase tracking-tighter">Confirm?</span>
                  ) : (
                    <Trash2 size={16} className={deletingId === budget._id ? "animate-spin" : ""} />
                  )}
                </button>

                <span className="text-xs font-bold text-slate-400">
                  <span className={isDanger ? "text-rose-600" : "text-slate-700"}>
                    ₹{budget.spent.toLocaleString()}
                  </span>
                  {" / "}
                  ₹{budget.limit.toLocaleString()}
                </span>
              </div>
              
              <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                <div 
                  className={`h-full transition-all duration-700 ease-out rounded-full ${
                    isDanger ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDanger ? "text-rose-500" : "text-slate-400"
                }`}>
                  {isDanger ? "Limit Exceeded" : `${Math.round(percent)}% Used`}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {budget.remaining > 0 ? `₹${budget.remaining.toLocaleString()} Left` : "No limit left"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
