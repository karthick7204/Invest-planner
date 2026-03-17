'use client';

import React, { useState } from 'react';

interface CategoryData {
  id: string;
  category: string;
  amountSpent: string;
  percentageOfSalary: number;
}

const CATEGORY_DATA: CategoryData[] = [
  { id: '1', category: 'Housing', amountSpent: '$2,150', percentageOfSalary: 45 },
  { id: '2', category: 'Food & Dining', amountSpent: '$920', percentageOfSalary: 19 },
  { id: '3', category: 'Transport', amountSpent: '$410', percentageOfSalary: 9 },
  { id: '4', category: 'Entertainment', amountSpent: '$450', percentageOfSalary: 9 },
  { id: '5', category: 'Savings & Invest', amountSpent: '$845', percentageOfSalary: 18 },
];

export default function CategoryBreakdown() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showDropdown, setShowDropdown] = useState(false);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
  
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const displayDate = `${months[selectedMonth]} ${selectedYear}`;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Category Breakdown</h2>
        
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
            <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Category</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Amount Spent</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">% of Salary</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORY_DATA.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-5 px-4">
                  <span className="text-gray-700 font-medium">{item.category}</span>
                </td>
                <td className="py-5 px-4">
                  <span className="text-gray-800 font-semibold">{item.amountSpent}</span>
                </td>
                <td className="py-5 px-4">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-medium w-8">{item.percentageOfSalary}%</span>
                    {/* Progress Bar */}
                    <div className="w-40 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${item.percentageOfSalary}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}