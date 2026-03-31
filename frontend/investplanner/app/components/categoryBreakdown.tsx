'use client';

import React, { useState, useEffect } from 'react';
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

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
  
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const displayDate = `${months[selectedMonth]} ${selectedYear}`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // month + 1 because selectedMonth is 0-indexed
        const data = await apiCall(`/expense/category-breakdown?range=${range}&month=${selectedMonth + 1}&year=${selectedYear}`);
        if (data && data.breakdown) {
          setCategoryData(data.breakdown);
        }
      } catch (error) {
        console.error("Error fetching category breakdown:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range, selectedMonth, selectedYear]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm min-h-[400px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Category Breakdown</h2>
        
        {/* Date Picker Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 text-black cursor-pointer hover:text-gray-600 font-medium transition"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="whitespace-nowrap">{displayDate}</span>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 w-64 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Month Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider text-[10px]">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider text-[10px]">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowDropdown(false)}
                className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-lg font-medium transition text-sm"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-400 font-black text-[10px] tracking-widest uppercase">Category</th>
              <th className="text-left py-3 px-4 text-gray-400 font-black text-[10px] tracking-widest uppercase">Amount Spent</th>
              <th className="text-left py-3 px-4 text-gray-400 font-black text-[10px] tracking-widest uppercase">% of Income</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="py-20 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin"></div>
                  <p className="mt-2 text-gray-500 font-medium">Loading report...</p>
                </td>
              </tr>
            ) : categoryData.length > 0 ? (
              categoryData.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 px-4">
                    <span className="text-gray-900 font-bold">{item.category}</span>
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-gray-900 font-bold text-lg">{item.amountSpent}</span>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-900 font-bold w-10 text-sm">{item.percentageOfSalary}%</span>
                      {/* Progress Bar */}
                      <div className="w-48 bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200/50">
                        <div
                          className="bg-yellow-400 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                          style={{ width: `${Math.min(100, item.percentageOfSalary)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-20 text-center">
                  <p className="text-gray-400 font-medium">No transaction data found for this period.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}