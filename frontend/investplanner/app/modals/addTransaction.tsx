'use client';

import React, { useState } from 'react';
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

const SUGGESTED_OTHER_EXPENSES = ['Education', 'Gifts', 'Insurance', 'Personal Care', 'Travel', 'Taxes', 'Home', 'Groceries', 'Subscriptions', 'Maintenance', 'Pets', 'Charity', 'Electronics'];
const SUGGESTED_OTHER_INCOME = ['Rental', 'Business', 'Freelance', 'Refund', 'Interest', 'Stock Market', 'Consulting', 'YouTube', 'Crypto', 'Part-time', 'Cashback', 'Lottery', 'Selling Items'];

export default function AddTransactionModal({ isOpen, onClose, onTransactionAdded }: AddTransactionModalProps) {
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

  const mainCategories = transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const otherSuggestions = transactionType === 'expense' ? SUGGESTED_OTHER_EXPENSES : SUGGESTED_OTHER_INCOME;

  const handleTypeChange = (type: 'expense' | 'income') => {
    setTransactionType(type);
    setIsOtherOpen(false);
    setFormData({
      ...formData,
      type,
      category: '', // Reset category when switching tabs
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ 
      ...formData, 
      amount: value === '' ? 0 : parseFloat(value) 
    });
  };

  const handleCategoryClick = (category: string) => {
    setIsOtherOpen(false);
    setFormData({ ...formData, category });
  };

  const handleOtherClick = () => {
    setIsOtherOpen(!isOtherOpen);
  };

  const handleCustomSubmit = (category: string) => {
    setFormData({ ...formData, category });
    setIsOtherOpen(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date: e.target.value });
  };

  const handlePurposeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, purpose: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form
    if (!formData.purpose) {
      setError('Please enter a purpose');
      setLoading(false);
      return;
    }
    if (formData.amount <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }
    if (!formData.category) {
      setError('Please select or enter a category');
      setLoading(false);
      return;
    }

    try {
      const endpoint = transactionType === 'expense' ? '/expense/create' : '/expense/income';

      await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          purpose: formData.purpose,
          amount: formData.amount,
          category: formData.category,
          date: formData.date,
        }),
      });

      // Reset form
      setFormData({
        purpose: '',
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0],
        type: transactionType,
      });

      // Callback to parent component
      if (onTransactionAdded) onTransactionAdded();
      
      // Notify other components (like BudgetStatus)
      window.dispatchEvent(new Event('transactionAdded'));
      
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isCategorySelected = (cat: string) => formData.category === cat;
  const isOtherSelected = !mainCategories.includes(formData.category) && formData.category !== '';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <div className="relative p-6 pb-0">
          <div className="flex justify-between items-center mb-2 text-black">
            <h2 className="text-2xl font-extrabold tracking-tight">Add Transaction</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-500 text-sm">
            {transactionType === 'expense' ? 'Track where your money goes' : 'Log your recent earnings'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex p-1 bg-gray-100 rounded-xl space-x-1">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                transactionType === 'expense'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">−</span> Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                transactionType === 'income'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">+</span> Income
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-1 tracking-widest uppercase">Purpose</label>
              <input
                type="text"
                value={formData.purpose}
                onChange={handlePurposeChange}
                placeholder={transactionType === 'expense' ? 'Coffee, Rent, etc.' : 'Salary, Freelance, etc.'}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-1 tracking-widest uppercase">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">₹</span>
                <input
                  type="number"
                  value={formData.amount || ''}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-2 tracking-widest uppercase">Category</label>
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 relative">
                {mainCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    className={`py-2.5 px-1 rounded-xl text-[11px] font-bold transition-all border ${
                      isCategorySelected(cat)
                        ? transactionType === 'expense'
                          ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-100'
                          : 'bg-green-600 border-green-600 text-white shadow-md shadow-green-100'
                        : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleOtherClick}
                    className={`w-full py-2.5 px-1 rounded-xl text-[11px] font-bold transition-all border flex items-center justify-center gap-1 ${
                      isOtherSelected
                        ? transactionType === 'expense'
                          ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-100'
                          : 'bg-green-600 border-green-600 text-white shadow-md shadow-green-100'
                        : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="truncate w-full">{isOtherSelected ? formData.category : 'Other'}</span>
                    <ChevronDown size={12} className={`shrink-0 transition-transform ${isOtherOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOtherOpen && (
                    <div className="absolute top-full right-0 mt-3 w-56 bg-white border border-gray-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                        <div className="relative">
                          <Plus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input
                            type="text"
                            placeholder="Type custom category..."
                            className="w-full pl-9 pr-3 py-2 bg-white text-[12px] rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium text-black"
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
                      <div className="max-h-52 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                        <div className="px-3 py-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Suggestions</div>
                        {otherSuggestions.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleCustomSubmit(cat)}
                            className="w-full text-left px-3 py-2.5 text-[11px] font-bold text-gray-700 hover:bg-gray-100 hover:text-black rounded-lg transition-all flex justify-between items-center group"
                          >
                            {cat}
                            {formData.category === cat ? (
                              <Check size={14} className="text-blue-500" />
                            ) : (
                              <ChevronDown size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 -rotate-90" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-1 tracking-widest uppercase">Transaction Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={handleDateChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-100 rounded-xl text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-4 text-white rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                transactionType === 'expense'
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-100'
                  : 'bg-green-600 hover:bg-green-700 shadow-green-100'
              }`}
            >
              {loading ? 'Saving...' : `Add ${transactionType === 'expense' ? 'Expense' : 'Income'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
