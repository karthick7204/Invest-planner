'use client';

import { useState, useEffect } from 'react';
import { apiCall } from '../lib/api';
import { Target, AlertCircle, MoreHorizontal, Trash2 } from 'lucide-react';

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
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (budgetId: string) => {
    if (confirmDeleteId !== budgetId) {
      setConfirmDeleteId(budgetId);
      setTimeout(() => setConfirmDeleteId(null), 3000);
      return;
    }

    setConfirmDeleteId(null);
    setDeletingId(budgetId);
    try {
      await apiCall(`/budget/${budgetId}`, {
        method: 'DELETE',
      });
      setBudgets(budgets.filter((b) => b._id !== budgetId));
      window.dispatchEvent(new Event('budgetUpdated'));
    } catch (error) {
      console.error('Error deleting budget:', error);
      alert('Failed to delete budget');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchBudgets();

    const handleUpdate = () => fetchBudgets();
    window.addEventListener('budgetUpdated', handleUpdate);
    window.addEventListener('transactionAdded', handleUpdate);

    return () => {
      window.removeEventListener('budgetUpdated', handleUpdate);
      window.removeEventListener('transactionAdded', handleUpdate);
    };
  }, []);

  if (loading || budgets.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-2xl border border-neutral-200/90 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-neutral-100 p-2.5 rounded-xl text-neutral-800">
            <Target size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 text-sm tracking-tight">Budget Progress</h3>
            <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
              Monthly spending ceilings
            </p>
          </div>
        </div>
        <button className="text-neutral-400 hover:text-neutral-900 transition">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const percent = Math.min(100, (budget.spent / budget.limit) * 100);
          const isDanger = budget.isExceeded;

          return (
            <div
              key={budget._id}
              className="relative flex flex-col gap-3 group p-3 rounded-xl hover:bg-neutral-50/70 border border-transparent hover:border-neutral-200/80 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-900 text-xs flex items-center gap-1.5">
                  {budget.category}
                  {isDanger && <AlertCircle size={13} className="text-rose-500 animate-pulse" />}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(budget._id);
                    }}
                    disabled={deletingId === budget._id}
                    className={`transition-all flex items-center gap-1 px-2 py-1 rounded text-xs font-mono 
                      ${
                        confirmDeleteId === budget._id
                          ? 'bg-black text-white'
                          : 'opacity-0 group-hover:opacity-100 bg-neutral-100 text-neutral-600 hover:text-black'
                      } ${deletingId === budget._id ? 'opacity-100 bg-neutral-100 cursor-not-allowed' : ''}`}
                    title={confirmDeleteId === budget._id ? 'Confirm Deletion' : 'Delete Budget'}
                  >
                    {confirmDeleteId === budget._id ? (
                      <span className="text-[10px] tracking-tight">Confirm?</span>
                    ) : (
                      <Trash2 size={13} className={deletingId === budget._id ? 'animate-spin' : ''} />
                    )}
                  </button>

                  <span className="font-mono text-[11px] text-neutral-400">
                    <span className={isDanger ? 'text-rose-600 font-semibold' : 'text-neutral-900'}>
                      ₹{budget.spent.toLocaleString()}
                    </span>
                    {' / '}
                    ₹{budget.limit.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Minimal Monochrome Progress Bar */}
              <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ease-out rounded-full ${
                    isDanger ? 'bg-rose-500' : 'bg-neutral-900'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className={isDanger ? 'text-rose-500 font-semibold' : 'text-neutral-400'}>
                  {isDanger ? 'Limit Exceeded' : `${Math.round(percent)}% Utilized`}
                </span>
                <span className="text-neutral-400">
                  {budget.remaining > 0 ? `₹${budget.remaining.toLocaleString()} Remaining` : '0 Left'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
