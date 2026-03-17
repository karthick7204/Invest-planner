'use client';

import React, { useState, useCallback } from 'react';

interface Transaction {
  id: string;
  merchant: string;
  initials: string;
  category: string;
  date: string;
  status: 'Completed' | 'Pending';
  amount: string;
  isExpense: boolean;
}

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: '1', merchant: 'Apple Store', initials: 'A', category: 'Electronics', date: 'Oct 24, 2024', status: 'Completed', amount: '-$1,299.00', isExpense: true },
  { id: '2', merchant: 'Monthly Salary', initials: 'M', category: 'Income', date: 'Oct 23, 2024', status: 'Completed', amount: '+$4,500.00', isExpense: false },
  { id: '3', merchant: 'Whole Foods', initials: 'W', category: 'Groceries', date: 'Oct 22, 2024', status: 'Pending', amount: '-$124.50', isExpense: true },
  { id: '4', merchant: 'Shell Gas Station', initials: 'S', category: 'Transport', date: 'Oct 21, 2024', status: 'Completed', amount: '-$65.00', isExpense: true },
  { id: '5', merchant: 'Netflix Subscription', initials: 'N', category: 'Entertainment', date: 'Oct 20, 2024', status: 'Completed', amount: '-$15.99', isExpense: true },
  { id: '6', merchant: 'Uber Ride', initials: 'U', category: 'Transport', date: 'Oct 19, 2024', status: 'Completed', amount: '-$32.50', isExpense: true },
  { id: '7', merchant: 'Starbucks', initials: 'S', category: 'Food & Drink', date: 'Oct 18, 2024', status: 'Completed', amount: '-$6.75', isExpense: true },
  { id: '8', merchant: 'Amazon Purchase', initials: 'A', category: 'Shopping', date: 'Oct 17, 2024', status: 'Pending', amount: '-$89.99', isExpense: true },
  { id: '9', merchant: 'Gym Membership', initials: 'G', category: 'Health', date: 'Oct 16, 2024', status: 'Completed', amount: '-$50.00', isExpense: true },
  { id: '10', merchant: 'Restaurant Dinner', initials: 'R', category: 'Dining', date: 'Oct 15, 2024', status: 'Completed', amount: '-$72.30', isExpense: true },
  { id: '11', merchant: 'Freelance Project', initials: 'F', category: 'Income', date: 'Oct 14, 2024', status: 'Completed', amount: '+$800.00', isExpense: false },
  { id: '12', merchant: 'Gas Bill', initials: 'G', category: 'Utilities', date: 'Oct 13, 2024', status: 'Completed', amount: '-$120.00', isExpense: true },
];

// Separate component for table rows to prevent re-rendering
const TableRows = React.memo(({ items }: { items: Transaction[] }) => (
  <>
    {items.map((transaction) => (
      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
        <td className="py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
              {transaction.initials}
            </div>
            <span className="text-gray-800 font-medium">{transaction.merchant}</span>
          </div>
        </td>
        <td className="py-4 px-4 text-gray-600">{transaction.category}</td>
        <td className="py-4 px-4 text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {transaction.date}
          </div>
        </td>
       
        <td className="py-4 px-4 text-right font-semibold">
          <span className={transaction.isExpense ? 'text-red-600' : 'text-green-600'}>
            {transaction.amount}
          </span>
        </td>
      </tr>
    ))}
  </>
));

TableRows.displayName = 'TableRows';

// Separate component for pagination to prevent re-rendering
const Pagination = React.memo(({ 
  totalPages, 
  currentPage, 
  onPageChange 
}: { 
  totalPages: number; 
  currentPage: number; 
  onPageChange: (page: number) => void;
}) => (
  <div className="mt-8 flex justify-center items-center gap-2">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
    >
      Previous
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`px-3 py-2 rounded-lg font-medium transition ${
          currentPage === page
            ? 'bg-blue-500 text-white'
            : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
        }`}
      >
        {page}
      </button>
    ))}

    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
    >
      Next
    </button>
  </div>
));

Pagination.displayName = 'Pagination';

export default function RecentTransaction() {
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  
  const paginatedItems = showAll
    ? SAMPLE_TRANSACTIONS.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : SAMPLE_TRANSACTIONS.slice(0, 5);

  const totalPages = Math.ceil(SAMPLE_TRANSACTIONS.length / itemsPerPage);

  const handleViewAll = useCallback(() => {
    setShowAll(true);
    setCurrentPage(1);
  }, []);

  const handleViewLess = useCallback(() => {
    setShowAll(false);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Recent Transactions</h2>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 016 0v12a1 1 0 01-6 0V4zM15 4a1 1 0 016 0v12a1 1 0 01-6 0V4z" />
            </svg>
            Filter
          </button>
          <button 
            onClick={showAll ? handleViewLess : handleViewAll}
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            {showAll ? 'View Less' : 'View All'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Merchant / Service</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Category</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Date</th>
              <th className="text-right py-3 px-4 text-gray-600 font-medium text-sm">Amount</th>
            </tr>
          </thead>
          <tbody>
            <TableRows items={paginatedItems} />
          </tbody>
        </table>
      </div>

      {/* Quick Add Expense Button (only show when not viewing all) */}
      {!showAll && (
        <div className="mt-8 flex justify-end">
          <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Quick Add Expense
          </button>
        </div>
      )}

      {/* Pagination (only show when viewing all) */}
      {showAll && (
        <Pagination 
          totalPages={totalPages} 
          currentPage={currentPage} 
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}