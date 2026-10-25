'use client';

import { useState, useEffect } from 'react';
import { apiCall } from '../lib/api';

interface CategoryData {
  id: string;
  category: string;
  amountSpent: string;
  percentageOfSalary: number;
}

interface CategoryBreakdownProps {
  range: string;
}

export default function CategoryBreakdown({ range }: CategoryBreakdownProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showDropdown, setShowDropdown] = useState(false);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      try {
        const data = await apiCall(
          `/expense/category-breakdown?range=${range}&month=${selectedMonth + 1}&year=${selectedYear}`
        );
        if (data && data.breakdown) {
          setCategoryData(data.breakdown);
        }
      } catch (error) {
        console.error('Error fetching category breakdown:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range, selectedMonth, selectedYear]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-sm min-h-[380px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-950 tracking-tight">
            Category Breakdown
          </h2>
          <p className="font-mono text-xs text-neutral-400 mt-0.5">
            Allocation distribution across accounts
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
            <div className="absolute right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl p-4 z-50 w-64 animate-in fade-in duration-150">
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
              <th className="text-left py-2.5 px-3">Category</th>
              <th className="text-left py-2.5 px-3">Amount Spent</th>
              <th className="text-left py-2.5 px-3">% of Income</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100/60 font-mono text-xs">
            {loading ? (
              <tr>
                <td colSpan={3} className="py-16 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
                  <p className="mt-2 text-neutral-400 text-xs">Loading breakdown...</p>
                </td>
              </tr>
            ) : categoryData.length > 0 ? (
              categoryData.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-sans font-medium text-neutral-900">{item.category}</span>
                  </td>
                  <td className="py-3 px-3 text-neutral-900 font-semibold">
                    {item.amountSpent}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-500 w-8">{item.percentageOfSalary}%</span>
                      <div className="w-36 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-neutral-900 h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${Math.min(100, item.percentageOfSalary)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-16 text-center text-neutral-400">
                  No transaction records for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}