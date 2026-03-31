'use client';

import React, { useState, useCallback, useEffect } from 'react';
import AddTransactionModal from '../modals/addTransaction';
import { apiCall } from '../lib/api';
import { Trash2, AlertCircle } from 'lucide-react';

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

const TableRows = React.memo(({ items, onDelete }: { items: Transaction[], onDelete: (id: string) => void }) => (
  <>
    {items.map((transaction) => (
      <tr key={transaction.id} className="group border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
        <td className="py-4 px-4">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
              transaction.isExpense ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
            }`}>
              {transaction.initials}
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 font-bold">{transaction.merchant}</span>
            </div>
          </div>
        </td>
        <td className="py-4 px-4">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wider">
            {transaction.category}
          </span>
        </td>
        <td className="py-4 px-4 text-gray-500 text-sm font-medium">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {transaction.date}
          </div>
        </td>
        <td className="py-4 px-4">
          <div className="flex items-center justify-end gap-6">
            <span className={`font-black text-lg ${transaction.isExpense ? 'text-gray-900' : 'text-green-600'}`}>
              {transaction.amount}
            </span>
            <button 
              onClick={() => onDelete(transaction.id)}
              className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all transform hover:scale-110"
              title="Delete transaction"
            >
              <Trash2 size={18} />
            </button>
          </div>
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
  <div className="mt-8 flex justify-center items-center gap-3">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2 transition"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Prev
    </button>

    <div className="flex items-center gap-1">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-xl font-black text-sm transition ${
            currentPage === page
              ? 'bg-black text-white shadow-lg shadow-gray-200'
              : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
    </div>

    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2 transition"
    >
      Next
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
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
          amount: t.type === 'expense' ? `-₹${t.amount.toLocaleString()}` : `+₹${t.amount.toLocaleString()}`,
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
    // Listen for transaction added events from other components
    if (typeof window !== 'undefined') {
      window.addEventListener('transactionAdded', fetchTransactions);
      return () => window.removeEventListener('transactionAdded', fetchTransactions);
    }
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await apiCall(`/expense/transaction/${id}`, { method: 'DELETE' });
      // Notify other components for real-time updates (like surplus card)
      handleTransactionAdded();
    } catch (error) {
      alert('Failed to delete transaction. Please try again.');
      console.error("Delete error:", error);
    }
  };

  const itemsPerPage = 8;
  
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
    fetchTransactions();
    typeof window !== 'undefined' && window.dispatchEvent(new Event('transactionAdded'));
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-4 sm:p-8 flex flex-col w-full min-h-[500px] sm:min-h-[600px] transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Recent Activity</h2>
          <p className="text-gray-400 text-xs sm:text-sm font-medium">Manage your daily transactions</p>
        </div>
        <button 
          onClick={showAll ? handleViewLess : handleViewAll}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 font-bold transition flex items-center justify-center gap-2 border border-gray-100 text-sm"
        >
          {showAll ? 'Collapse' : 'Manage All'}
          <svg className={`w-4 h-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Table / List Container */}
      <div className="w-full flex-grow overflow-hidden">
        {/* Desktop Table - Hidden on Mobile */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-gray-400 font-bold text-[10px] tracking-widest uppercase">Merchant / Service</th>
                <th className="text-left py-4 px-4 text-gray-400 font-bold text-[10px] tracking-widest uppercase">Category</th>
                <th className="text-left py-4 px-4 text-gray-400 font-bold text-[10px] tracking-widest uppercase">Date</th>
                <th className="text-right py-4 px-4 text-gray-400 font-bold text-[10px] tracking-widest uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-400 font-bold text-sm">Syncing transactions...</p>
                  </td>
                </tr>
              ) : paginatedItems.length > 0 ? (
                <TableRows items={paginatedItems} onDelete={handleDelete} />
              ) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-300">
                      <AlertCircle size={48} strokeWidth={1} />
                      <p className="font-bold text-lg">No transactions found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet List - Visible only on smaller screens */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-400 font-bold text-sm">Syncing transactions...</p>
            </div>
          ) : paginatedItems.length > 0 ? (
            paginatedItems.map((transaction) => (
              <div 
                key={transaction.id} 
                className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 relative group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm ${
                    transaction.isExpense ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {transaction.initials}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-gray-900 font-bold truncate">{transaction.merchant}</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{transaction.category}</span>
                  </div>
                  <div className="text-right">
                    <div className={`font-black text-lg ${transaction.isExpense ? 'text-gray-900' : 'text-green-600'}`}>
                      {transaction.amount}
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">{transaction.date}</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(transaction.id)}
                  className="absolute -top-2 -right-2 bg-white p-2 text-gray-400 hover:text-red-500 rounded-full shadow-md border border-gray-100 transition-all active:scale-95"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-3 text-gray-300">
              <AlertCircle size={48} strokeWidth={1} />
              <p className="font-bold text-lg">No transactions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer and Controls */}
      <div className="mt-auto pt-8 border-t border-gray-50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full order-2 sm:order-1">
            {showAll && transactionsData.length > 0 && (
              <Pagination 
                totalPages={totalPages} 
                currentPage={currentPage} 
                onPageChange={handlePageChange}
              />
            )}
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition shadow-xl shadow-gray-200 order-1 sm:order-2 active:scale-95"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-lg">+</span>
            </div>
            Quick Add
          </button>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={handleTransactionAdded}
      />
    </div>
  );
}