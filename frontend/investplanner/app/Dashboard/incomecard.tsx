'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { apiCall } from '../lib/api';

export default function IncomeCard() {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIncome = async () => {
      setLoading(true);
      try {
        const data = await apiCall('/expense/income');
        if (data && data.income) {
          const total = data.income.reduce(
            (sum: number, item: { amount?: number | string }) => sum + (Number(item.amount) || 0),
            0
          );
          setTotalIncome(total);
        }
      } catch (error) {
        console.error('Failed to fetch income:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();

    if (typeof window !== 'undefined') {
      window.addEventListener('transactionAdded', fetchIncome);
      return () => window.removeEventListener('transactionAdded', fetchIncome);
    }
  }, []);

  return (
    <div className="w-full bg-white rounded-2xl border border-neutral-200/90 shadow-sm p-6 flex flex-col justify-between transition-all hover:shadow-md group">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
            Total Income
          </p>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 font-mono mt-1">
            {loading ? '—' : `₹${totalIncome.toLocaleString('en-IN')}`}
          </h3>
        </div>
        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 group-hover:bg-black group-hover:text-white transition-colors">
          <ArrowUpRight size={16} />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span>Inflow velocity</span>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
          Verified
        </span>
      </div>
    </div>
  );
}