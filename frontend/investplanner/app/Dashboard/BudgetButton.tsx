'use client';

import { useState } from 'react';
import { Plus, X, Check, Loader2 } from 'lucide-react';
import { apiCall } from '../lib/api';

export function BudgetButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('General');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const currentMonth = new Date().toISOString().substring(0, 7);

      await apiCall('/budget/set', {
        method: 'POST',
        body: JSON.stringify({
          category,
          limit: Number(amount),
          month: currentMonth,
        }),
      });

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setAmount('');
        window.dispatchEvent(new Event('budgetUpdated'));
      }, 1200);
    } catch (error) {
      console.error('Failed to set budget:', error);
      alert('Error saving budget. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'General',
    'Food',
    'Transport',
    'Rent',
    'Groceries',
    'Entertainment',
    'Shopping',
    'Utilities',
    'Healthcare',
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-4 py-2 rounded-xl shadow-sm active:scale-95 transition font-medium text-xs cursor-pointer"
      >
        <Plus size={15} />
        <span>Set Budget</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 mt-2 w-80 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-neutral-200 p-6 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-neutral-900 text-sm tracking-tight">Define Budget Ceiling</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-neutral-900 transition cursor-pointer p-1 rounded-md"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs text-neutral-900 bg-neutral-50/60 border border-neutral-200 rounded-lg p-2.5 focus:outline-none focus:border-neutral-900 focus:bg-white transition"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block mb-1.5">
                Monthly Limit
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-mono">
                  ₹
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-xs text-neutral-900 bg-neutral-50/60 border border-neutral-200 rounded-lg p-2.5 pl-7 font-mono focus:outline-none focus:border-neutral-900 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className={`mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition font-medium text-xs shadow-sm cursor-pointer ${
                success
                  ? 'bg-neutral-900 text-white'
                  : 'bg-black text-white hover:bg-neutral-800 disabled:opacity-50'
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : success ? (
                <>
                  <Check size={14} />
                  <span>Saved</span>
                </>
              ) : (
                'Save Budget Goal'
              )}
            </button>
          </form>

          <p className="mt-4 text-[10px] font-mono text-center text-neutral-400">
            Applies to {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      )}
    </div>
  );
}
