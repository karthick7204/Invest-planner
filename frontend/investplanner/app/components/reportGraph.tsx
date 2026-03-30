'use client';

import React, { useState, useEffect } from 'react';
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

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
  
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const displayDate = `${months[selectedMonth]} ${selectedYear}`;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Format month and year into "YYYY-MM"
        const monthStr = (selectedMonth + 1).toString().padStart(2, '0');
        const formattedDate = `${selectedYear}-${monthStr}`;
        
        const response = await apiCall(`/budget?month=${formattedDate}&range=${range}`);
        
        if (response && response.budgets) {
          const mappedData = response.budgets.map((b: any) => ({
            category: b.category,
            budget: b.limit,
            spending: b.spent
          }));
          setSpendingData(mappedData);
        } else {
          setSpendingData([]);
        }
      } catch (err) {
        console.error("Error fetching spending data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, range]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Spending vs. Budget</h2>
          <p className="text-gray-500 text-sm mt-1">Visual breakdown of allocation efficiency per category</p>
        </div>
        
        {/* Date Picker Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700 font-medium transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {displayDate}
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 w-48">
              {/* Month Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[350px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 font-medium">
            {error}
          </div>
        ) : spendingData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium italic">
            No budget data found for {displayDate}
          </div>
        ) : null}

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={spendingData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              formatter={(value: any) => `₹${(Number(value) || 0).toLocaleString()}`}
            />
            <Bar
              dataKey="budget"
              fill="#e5e7eb"
              radius={[4, 4, 0, 0]}
              name="Budget"
            />
            <Bar
              dataKey="spending"
              fill="#facc15"
              radius={[4, 4, 0, 0]}
              name="Spending"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-8 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-gray-600 text-sm">Budget</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span className="text-gray-600 text-sm">Spending</span>
        </div>
      </div>
    </div>
  );
}