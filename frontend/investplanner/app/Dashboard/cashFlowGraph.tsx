'use client';

import { useState, useEffect } from 'react';
import IncomeExpensesChart from '../components/graphChart';
import { apiCall } from '../lib/api';
import { Calendar, PieChart, Filter } from 'lucide-react';

interface ChartData {
  day?: string;
  name?: string;
  expenses: number;
}

export function CashFlowGraph() {
  const [graphData, setGraphData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'daily' | 'category'>('daily');

  const fetchGraphData = async (mode: 'daily' | 'category') => {
    setLoading(true);
    try {
      const response = await apiCall(`/expense/graphdata?mode=${mode}`);
      if (response && response.graphData) {
        setGraphData(response.graphData);
      }
    } catch (error) {
      console.error('Failed to fetch graph data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData(filterMode);

    const handleTransactionAdded = () => fetchGraphData(filterMode);
    if (typeof window !== 'undefined') {
      window.addEventListener('transactionAdded', handleTransactionAdded);
      return () => window.removeEventListener('transactionAdded', handleTransactionAdded);
    }
  }, [filterMode]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-neutral-200/90 p-6 flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-lg font-semibold text-neutral-950 tracking-tight">
            Expense Statistics
          </h2>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            {filterMode === 'daily'
              ? 'Trends from the last 30 days'
              : 'Today&apos;s expenses by category'}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider ml-1 flex items-center gap-1">
            <Filter size={10} />
            View Filter
          </span>
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl self-start border border-neutral-200/60">
            <button
              onClick={() => setFilterMode('daily')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                filterMode === 'daily'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Calendar size={13} />
              Daily History
            </button>
            <button
              id="category-filter-btn"
              onClick={() => setFilterMode('category')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                filterMode === 'category'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <PieChart size={13} />
              Today&apos;s Categories
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-[340px] md:h-[380px] flex items-center justify-center relative">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-7 h-7 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
            <p className="font-mono text-xs text-neutral-400">Analyzing transactions...</p>
          </div>
        ) : graphData.length > 0 ? (
          <IncomeExpensesChart
            data={graphData}
            dataKey={filterMode === 'daily' ? 'day' : 'name'}
          />
        ) : (
          <div className="text-neutral-400 border border-dashed border-neutral-200 rounded-xl p-10 flex flex-col items-center justify-center w-full h-full gap-2">
            <Filter size={24} className="text-neutral-300" />
            <p className="text-xs font-medium text-neutral-600">No expenses recorded for this view</p>
            <p className="font-mono text-[11px] text-neutral-400">
              Add a new transaction to see results here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}