'use client';

import React, { useState } from 'react';
import { apiCall } from '@/app/lib/api';

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
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other'];

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

  const categories = transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTypeChange = (type: 'expense' | 'income') => {
    setTransactionType(type);
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
    setFormData({ ...formData, category });
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
      setError('Please select a category');
      setLoading(false);
      return;
    }

    try {
      // ✅ Different API endpoints for expense and income
      const endpoint = transactionType === 'expense' ? '/expense/create' : '/expense/income';

      const response = await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          purpose: formData.purpose,
          amount: formData.amount,
          category: formData.category,
          date: formData.date,
        }),
      });

      console.log(`✅ ${transactionType === 'expense' ? 'Expense' : 'Income'} created:`, response);

      // Reset form
      setFormData({
        purpose: '',
        amount:0,
        category: '',
        date: new Date().toISOString().split('T')[0],
        type: transactionType,
      });

      // Callback to parent component
      if (onTransactionAdded) {
        onTransactionAdded();
      }

      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create transaction');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
              transactionType === 'expense'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            - Expense
          </button>
          <button
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
              transactionType === 'income'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            + Income
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          {transactionType === 'expense' ? 'Record your daily expenses' : 'Record your income'}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Purpose */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">PURPOSE</label>
            <input
              type="text"
              value={formData.purpose}
              onChange={handlePurposeChange}
              placeholder={transactionType === 'expense' ? 'What did you spend on?' : 'What was the income from?'}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">AMOUNT</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-black">₹</span>
              <input
                type="number"
               value={formData.amount || ''}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Quick Select Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">CATEGORY</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                    formData.category === cat
                      ? transactionType === 'expense'
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">DATE</label>
            <input
              type="date"
              value={formData.date}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2 px-4 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                transactionType === 'expense'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
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
