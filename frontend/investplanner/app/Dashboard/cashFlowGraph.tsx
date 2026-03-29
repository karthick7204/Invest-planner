"use client";
import { useState, useEffect } from "react";
import IncomeExpensesChart from "../components/graphChart";
import { apiCall } from "../lib/api";
import { Calendar, PieChart, Filter } from "lucide-react";

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
      console.error("Failed to fetch graph data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData(filterMode);

    // Re-fetch when a new transaction is added
    const handleTransactionAdded = () => fetchGraphData(filterMode);
    if (typeof window !== 'undefined') {
      window.addEventListener('transactionAdded', handleTransactionAdded);
      return () => window.removeEventListener('transactionAdded', handleTransactionAdded);
    }
  }, [filterMode]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Expense Statistics
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {filterMode === 'daily' ? "Trends from the last 30 days" : "Today's expenses by category"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
            <Filter size={10} />
            Show View
          </span>
          <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl self-start border border-slate-100">
            <button
              onClick={() => setFilterMode('daily')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                filterMode === 'daily' 
                  ? "bg-white text-amber-600 shadow-sm border border-amber-100" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
              }`}
            >
              <Calendar size={16} />
              Daily History
            </button>
            <button
              id="category-filter-btn"
              onClick={() => setFilterMode('category')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                filterMode === 'category' 
                  ? "bg-white text-amber-600 shadow-sm border border-amber-100" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
              }`}
            >
              <PieChart size={16} />
              Today's Categories
            </button>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[350px] md:h-[400px] flex items-center justify-center relative">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
            <p className="text-sm text-slate-400 font-medium">Analyzing data...</p>
          </div>
        ) : graphData.length > 0 ? (
          <IncomeExpensesChart 
            data={graphData} 
            dataKey={filterMode === 'daily' ? "day" : "name"}
          />
        ) : (
          <div className="text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl p-12 flex flex-col items-center justify-center w-full h-full gap-3">
            <Filter size={32} className="text-slate-200" />
            <p className="font-medium">No expenses recorded for this view</p>
            <p className="text-xs text-slate-400">Try adding a new transaction to see results here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
