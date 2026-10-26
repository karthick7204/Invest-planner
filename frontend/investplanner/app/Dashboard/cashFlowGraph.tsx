'use client';

import { useState, useEffect, useCallback } from 'react';
import IncomeExpensesChart, { ChartData } from '../components/graphChart';
import { apiCall } from '../lib/api';
import { PieChart, Clock } from 'lucide-react';

type PeriodMode = 'month' | '30days' | 'today' | 'all';

export function CashFlowGraph() {
  const [graphData, setGraphData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodMode>('month');

  const fetchGraphData = useCallback(async (selectedPeriod: PeriodMode) => {
    setLoading(true);
    try {
      const response = await apiCall(
        `/expense/graphdata?mode=category&period=${selectedPeriod}`
      );
      if (response && response.graphData && response.graphData.length > 0) {
        setGraphData(response.graphData);
      } else {
        // Fallback: Check /expense/expenses directly in case transaction records differ
        const expRes = await apiCall('/expense/expenses');
        if (expRes && expRes.expenses && expRes.expenses.length > 0) {
          const catMap = new Map<string, number>();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expRes.expenses.forEach((item: any) => {
            const rawCat = item.category || 'Other';
            const cat = rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
            catMap.set(cat, (catMap.get(cat) || 0) + (Number(item.amount) || 0));
          });
          const mapped: ChartData[] = Array.from(catMap.entries()).map(
            ([name, expenses]) => ({
              name,
              category: name,
              expenses,
            })
          );
          setGraphData(mapped);
        } else {
          setGraphData([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch expense categories:', error);
      setGraphData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraphData(period);

    const handleTransactionAdded = () => fetchGraphData(period);
    if (typeof window !== 'undefined') {
      window.addEventListener('transactionAdded', handleTransactionAdded);
      return () => window.removeEventListener('transactionAdded', handleTransactionAdded);
    }
  }, [period, fetchGraphData]);

  const periodOptions: { label: string; value: PeriodMode }[] = [
    { label: 'This Month', value: 'month' },
    { label: 'Last 30 Days', value: '30days' },
    { label: 'Today', value: 'today' },
    { label: 'All Time', value: 'all' },
  ];

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-neutral-200/90 p-6 flex flex-col">
      {/* Top Header & Period Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center">
              <PieChart size={13} />
            </div>
            <h2 className="text-lg font-semibold text-neutral-950 tracking-tight">
              Expense Statistics
            </h2>
          </div>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Expense categories and their percentages in pie chart
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider hidden sm:flex items-center gap-1 mr-1">
            <Clock size={11} />
            Range
          </span>
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200/60">
            {periodOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition cursor-pointer ${
                  period === opt.value
                    ? 'bg-black text-white font-medium shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas Area: Always displays Pie Chart with Categories & Percentages */}
      <div className="w-full min-h-[340px] md:min-h-[380px] flex items-center justify-center relative">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="w-7 h-7 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
            <p className="font-mono text-xs text-neutral-400">
              Calculating category percentages...
            </p>
          </div>
        ) : (
          <IncomeExpensesChart
            data={graphData}
            isSampleData={graphData.length === 0}
          />
        )}
      </div>
    </div>
  );
}

export default CashFlowGraph;