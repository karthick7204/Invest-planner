'use client';

import React, { useState, useCallback, useEffect } from 'react';
import AddTransactionModal from '../modals/addTransaction';
import { apiCall } from '../lib/api';
import { Trash2, AlertCircle, Plus } from 'lucide-react';

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

const TableRows = React.memo(
  ({
    items,
    onDelete,
  }: {
    items: Transaction[];
    onDelete: (id: string) => void;
  }) => (
    <>
      {items.map((transaction) => (
        <tr
          key={transaction.id}
          className="group border-b border-neutral-100/80 hover:bg-neutral-50/50 transition-colors"
        >
          <td className="py-3.5 px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center font-mono text-xs font-semibold text-neutral-700">
                {transaction.initials}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-neutral-900 group-hover:text-black">
                  {transaction.merchant}
                </span>
              </div>
            </div>
          </td>
          <td className="py-3.5 px-4">
            <span className="font-mono text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
              {transaction.category}
            </span>
          </td>
          <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-400">
            {transaction.date}
          </td>
          <td className="py-3.5 px-4">
            <div className="flex items-center justify-end gap-4">
              <span
                className={`font-mono text-xs font-medium ${
                  transaction.isExpense ? 'text-neutral-900' : 'text-neutral-900 font-semibold'
                }`}
              >
                {transaction.amount}
              </span>
              <button
                onClick={() => onDelete(transaction.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50/50 rounded-md transition-all cursor-pointer"
                title="Delete transaction"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  )
);

TableRows.displayName = 'TableRows';

const Pagination = React.memo(
  ({
    totalPages,
    currentPage,
    onPageChange,
  }: {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  }) => (
    <div className="mt-6 flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-mono text-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50 transition cursor-pointer"
      >
        Prev
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-7 h-7 rounded-lg font-mono text-xs transition cursor-pointer ${
              currentPage === page
                ? 'bg-black text-white shadow-sm'
                : 'text-neutral-400 hover:bg-neutral-100'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-mono text-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50 transition cursor-pointer"
      >
        Next
      </button>
    </div>
  )
);

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
        const mappedData: Transaction[] = data.transactions.map((t: {
          _id: string;
          topic?: string;
          category: string;
          date: string;
          type: string;
          amount: number;
        }) => ({
          id: t._id,
          merchant: t.topic || 'Unknown',
          initials: (t.topic || '?').charAt(0).toUpperCase(),
          category: t.category,
          date: new Date(t.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          status: 'Completed',
          amount:
            t.type === 'expense'
              ? `-₹${t.amount.toLocaleString()}`
              : `+₹${t.amount.toLocaleString()}`,
          isExpense: t.type === 'expense',
        }));
        setTransactionsData(mappedData);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    if (typeof window !== 'undefined') {
      window.addEventListener('transactionAdded', fetchTransactions);
      return () => window.removeEventListener('transactionAdded', fetchTransactions);
    }
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      await apiCall(`/expense/transaction/${id}`, { method: 'DELETE' });
      fetchTransactions();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('transactionAdded'));
      }
    } catch (error) {
      alert('Failed to delete transaction. Please try again.');
      console.error('Delete error:', error);
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('transactionAdded'));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/90 p-6 flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-950 tracking-tight">
            Recent Activity
          </h2>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Extracted transaction ledger
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={showAll ? handleViewLess : handleViewAll}
            className="px-3.5 py-1.5 rounded-lg text-neutral-600 hover:text-black bg-neutral-50 hover:bg-neutral-100 text-xs font-mono transition border border-neutral-200/80 cursor-pointer"
          >
            {showAll ? 'Collapse' : 'View All'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition shadow-sm cursor-pointer active:scale-95"
          >
            <Plus size={14} />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 font-mono text-[10px] uppercase tracking-wider text-neutral-400">
              <th className="text-left py-3 px-4">Merchant / Event</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-right py-3 px-4">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100/60">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-16 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
                  <p className="mt-3 font-mono text-xs text-neutral-400">Syncing ledger...</p>
                </td>
              </tr>
            ) : paginatedItems.length > 0 ? (
              <TableRows items={paginatedItems} onDelete={handleDelete} />
            ) : (
              <tr>
                <td colSpan={4} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-neutral-400">
                    <AlertCircle size={24} strokeWidth={1.5} />
                    <p className="text-xs font-medium text-neutral-600">No transactions recorded</p>
                    <p className="font-mono text-[11px] text-neutral-400">
                      Add a transaction to view ledger entries.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAll && transactionsData.length > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={handleTransactionAdded}
      />
    </div>
  );
}