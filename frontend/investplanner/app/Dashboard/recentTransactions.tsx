'use client';

import React, { useState, useCallback, useEffect } from 'react';
import AddTransactionModal from '../modals/addTransaction';
import { apiCall } from '../lib/api';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const data = await apiCall('/expense/transactions?limit=50');
      if (data && data.transactions) {
        const mappedData: Transaction[] = data.transactions.map((t: any) => ({
          id: t._id,
          merchant: t.topic || 'Unknown',
          initials: (t.topic || '?').charAt(0).toUpperCase(),
          category: t.category,
          date: new Date(t.date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          }),
          status: 'Completed',
          amount: t.type === 'expense' ? `-₹${t.amount}` : `+₹${t.amount}`,
          isExpense: t.type === 'expense'
        }));
        setTransactionsData(mappedData);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const itemsPerPage = 10;
  
  const paginatedItems = showAll
    ? transactionsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : transactionsData.slice(0, 5);

  const totalPages = Math.max(1, Math.ceil(transactionsData.length / itemsPerPage));

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

  const handleTransactionAdded = () => {
    console.log('✅ Transaction added successfully');
    // Refresh transactions list
    fetchTransactions();
    // Dispatch an event to update other components like cards
    typeof window !== 'undefined' && window.dispatchEvent(new Event('transactionAdded'));
  };

  return (
    <div className="bg-white hover:shadow-md transition-shadow duration-300 rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col w-full">
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
      <div className="w-full overflow-x-auto rounded-md border border-gray-50">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Merchant / Service</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Category</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm hidden sm:table-cell">Date</th>
              <th className="text-right py-3 px-4 text-gray-600 font-medium text-sm">Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center text-gray-500">Loading transactions...</td>
              </tr>
            ) : paginatedItems.length > 0 ? (
              <TableRows items={paginatedItems} />
            ) : (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center text-gray-500">No recent transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Add Expense Button - Always visible */}
      <div className="mt-8 flex justify-end shrink-0">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Quick Add Expense
        </button>
      </div>

      {/* Pagination (only show when viewing all) */}
      <div className="empty:hidden mt-6">
        {showAll && transactionsData.length > 0 && (
          <Pagination 
            totalPages={totalPages} 
            currentPage={currentPage} 
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Add Transaction Modal - with blur background */}
      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={handleTransactionAdded}
      />
    </div>
  );
}