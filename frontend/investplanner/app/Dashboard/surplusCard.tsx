'use client';

import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { apiCall } from '../lib/api';

export function SurplusCard() {
  const [surplus, setSurplus] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSurplus = async () => {
      setLoading(true);
      try {
        const data = await apiCall('/expense/surplusincome');
        if (data && data.surplus !== undefined) {
          setSurplus(data.surplus);
        }
      } catch (error) {
        console.error('Failed to fetch surplus:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurplus();

    if (typeof window !== 'undefined') {
      window.addEventListener('transactionAdded', fetchSurplus);
      return () => window.removeEventListener('transactionAdded', fetchSurplus);
    }
  }, []);

  return (
    <div className="w-full bg-white rounded-2xl border border-neutral-200/90 shadow-sm p-6 flex flex-col justify-between transition-all hover:shadow-md group">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
            Total Net Balance
          </p>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 font-mono mt-1">
            {loading ? '—' : `₹${surplus.toLocaleString('en-IN')}`}
          </h3>
        </div>
        <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center transition-transform group-hover:scale-105">
          <Wallet size={16} />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span>Runway capacity</span>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-black text-white">
          Active
        </span>
      </div>
    </div>
  );
}