'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { apiCall } from '../lib/api';

interface SpendingData {
  category: string;
  budget: number;
  spending: number;
}

interface ReportGraphProps {
  range: string;
}

export default function ReportGraph({ range }: ReportGraphProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showDropdown, setShowDropdown] = useState(false);
  const [spendingData, setSpendingData] = useState<SpendingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const displayDate = `${months[selectedMonth]} ${selectedYear}`;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const monthStr = (selectedMonth + 1).toString().padStart(2, '0');
        const formattedDate = `${selectedYear}-${monthStr}`;

        const response = await apiCall(`/budget?month=${formattedDate}&range=${range}`);

        if (response && response.budgets) {
          const mappedData = response.budgets.map((b: { category: string; limit: number; spent: number }) => ({
            category: b.category,
            budget: b.limit,
            spending: b.spent,
          }));
          setSpendingData(mappedData);
        } else {
          setSpendingData([]);
        }
      } catch (err) {
        console.error('Error fetching spending data:', err);
        setError('Failed to load budget comparison.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, range]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-950 tracking-tight">
            Spending vs. Budget
          </h2>
          <p className="font-mono text-xs text-neutral-400 mt-0.5">
            Allocation efficiency per category
          </p>
        </div>

        {/* Date Picker Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-mono text-neutral-700 hover:text-black hover:bg-neutral-50 transition cursor-pointer"
          >
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{displayDate}</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl p-4 z-50 w-52 animate-in fade-in duration-150">
              <div className="mb-3">
                <label className="block font-mono text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block font-mono text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowDropdown(false)}
                className="w-full bg-black hover:bg-neutral-800 text-white py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[320px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
            <div className="animate-spin rounded-full h-7 w-7 border-2 border-neutral-200 border-t-black"></div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-rose-500">
            {error}
          </div>
        ) : spendingData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-neutral-400 italic">
            No budget data recorded for {displayDate}
          </div>
        ) : null}

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={spendingData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fill: '#737373', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#f3f4f6' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#737373', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#f3f4f6' }}
              tickLine={false}
              tickFormatter={(val) => `₹${val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a0a0a',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                padding: '8px 12px',
                fontFamily: 'monospace',
                fontSize: '11px',
                color: '#ffffff',
              }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [
                `₹${(Number(value) || 0).toLocaleString()}`,
              ]}
            />
            <Bar dataKey="budget" fill="#e5e7eb" radius={[3, 3, 0, 0]} name="Budget Limit" />
            <Bar dataKey="spending" fill="#0a0a0a" radius={[3, 3, 0, 0]} name="Actual Outflow" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-neutral-200 rounded-sm"></div>
          <span className="text-neutral-500">Budget Limit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black rounded-sm"></div>
          <span className="text-neutral-900 font-medium">Actual Outflow</span>
        </div>
      </div>
    </div>
  );
}