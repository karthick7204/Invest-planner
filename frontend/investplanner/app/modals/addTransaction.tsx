'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { apiCall } from '@/app/lib/api';
import { ChevronDown, Plus, X, Check } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded?: () => void;
}

interface TransactionData {
  purpose: string;
  amount: number;
  category: string;
  date: string;
  type: 'expense' | 'income';
}

const EXPENSE_CATEGORIES = ['Dining', 'Transport', 'Shopping', 'Utilities', 'Work', 'Health', 'Entertainment'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Commission', 'Dividends', 'Gifts'];

const SUGGESTED_OTHER_EXPENSES = [
  'Education',
  'Gifts',
  'Insurance',
  'Personal Care',
  'Travel',
  'Taxes',
  'Home',
  'Groceries',
  'Subscriptions',
  'Maintenance',
  'Pets',
  'Charity',
  'Electronics',
];
const SUGGESTED_OTHER_INCOME = [
  'Rental',
  'Business',
  'Freelance',
  'Refund',
  'Interest',
  'Stock Market',
  'Consulting',
  'YouTube',
  'Crypto',
  'Part-time',
  'Cashback',
  'Lottery',
  'Selling Items',
];

export default function AddTransactionModal({
  isOpen,
  onClose,
  onTransactionAdded,
}: AddTransactionModalProps) {
  const [mounted, setMounted] = useState(false);
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [formData, setFormData] = useState<TransactionData>({
    purpose: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOtherOpen, setIsOtherOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const mainCategories = transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const otherSuggestions = transactionType === 'expense' ? SUGGESTED_OTHER_EXPENSES : SUGGESTED_OTHER_INCOME;

  const handleTypeChange = (type: 'expense' | 'income') => {
    setTransactionType(type);
    setIsOtherOpen(false);
    setFormData((prev) => ({
      ...prev,
      type,
      category: '',
    }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      amount: value === '' ? 0 : parseFloat(value),
    }));
  };

  const handleCategoryClick = (category: string) => {
    setIsOtherOpen(false);
    setFormData((prev) => ({ ...prev, category }));
  };

  const handleOtherClick = () => {
    setIsOtherOpen(!isOtherOpen);
  };

  const handleCustomSubmit = (category: string) => {
    setFormData((prev) => ({ ...prev, category }));
    setIsOtherOpen(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, date: e.target.value }));
  };

  const handlePurposeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, purpose: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.purpose.trim()) {
      setError('Please enter a purpose or merchant');
      return;
    }
    if (formData.amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!formData.category) {
      setError('Please select or enter a category');
      return;
    }

    setLoading(true);

    try {
      const endpoint = transactionType === 'expense' ? '/expense/create' : '/expense/income';

      await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          purpose: formData.purpose.trim(),
          amount: formData.amount,
          category: formData.category,
          date: formData.date,
        }),
      });

      setFormData({
        purpose: '',
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0],
        type: transactionType,
      });

      if (onTransactionAdded) onTransactionAdded();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('transactionAdded'));
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const isCategorySelected = (cat: string) => formData.category === cat;
  const isOtherSelected = !mainCategories.includes(formData.category) && formData.category !== '';

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200/90 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start shrink-0 border-b border-neutral-100">
          <div>
            <h2 id="modal-title" className="text-base sm:text-lg font-semibold text-neutral-950 tracking-tight">
              Add Transaction
            </h2>
            <p className="font-mono text-xs text-neutral-400 mt-0.5">
              {transactionType === 'expense' ? 'Log an outflow deduction' : 'Log an inflow deposit'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Expense / Income Toggle */}
            <div className="flex p-1 bg-neutral-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  transactionType === 'expense'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                − Expense Outflow
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  transactionType === 'income'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                + Income Inflow
              </button>
            </div>

            {error && (
              <div className="p-2.5 bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs rounded-lg font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              {/* Purpose */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                  Purpose / Merchant
                </label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={handlePurposeChange}
                  placeholder={transactionType === 'expense' ? 'AWS Cloud Hosting' : 'Client Retainer'}
                  className="w-full px-3 py-2 bg-neutral-50/60 border border-neutral-200 text-neutral-900 text-xs rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white transition"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                  Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={formData.amount || ''}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 bg-neutral-50/60 border border-neutral-200 text-neutral-900 text-xs font-mono rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Category selection */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 relative">
                  {mainCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryClick(cat)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-mono transition border cursor-pointer ${
                        isCategorySelected(cat)
                          ? 'bg-black text-white border-black shadow-sm'
                          : 'bg-neutral-50/70 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}

                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleOtherClick}
                      className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-mono transition border flex items-center justify-center gap-1 cursor-pointer ${
                        isOtherSelected
                          ? 'bg-black text-white border-black shadow-sm'
                          : 'bg-neutral-50/70 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <span className="truncate">{isOtherSelected ? formData.category : 'Other'}</span>
                      <ChevronDown size={10} className={`shrink-0 ${isOtherOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOtherOpen && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in duration-150">
                        <div className="p-2 border-b border-neutral-100 bg-neutral-50">
                          <div className="relative">
                            <Plus size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                              type="text"
                              placeholder="Custom category..."
                              className="w-full pl-7 pr-2 py-1.5 bg-white text-xs rounded-md border border-neutral-200 outline-none focus:border-neutral-900 font-mono text-neutral-900"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (e.currentTarget.value) handleCustomSubmit(e.currentTarget.value);
                                }
                              }}
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="max-h-40 overflow-y-auto p-1 font-mono text-[11px]">
                          {otherSuggestions.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => handleCustomSubmit(cat)}
                              className="w-full text-left px-2 py-1.5 text-neutral-700 hover:bg-neutral-100 rounded flex justify-between items-center cursor-pointer"
                            >
                              <span>{cat}</span>
                              {formData.category === cat && <Check size={12} className="text-black" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                  Transaction Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 bg-neutral-50/60 border border-neutral-200 text-neutral-900 text-xs font-mono rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-3 border border-neutral-200 rounded-lg text-neutral-600 font-medium text-xs hover:bg-neutral-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-3 bg-black hover:bg-neutral-800 text-white rounded-lg font-medium text-xs shadow-sm transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Recording...' : `Record ${transactionType === 'expense' ? 'Outflow' : 'Inflow'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
