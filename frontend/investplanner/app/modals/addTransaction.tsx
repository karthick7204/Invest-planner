'use client';

import React, { useState } from 'react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionData) => void;
}

interface TransactionData {
  type: 'Income' | 'Expense';
  amount: string;
  category: string;
  date: string;
  notes: string;
}

const QUICK_CATEGORIES = ['Dining', 'Transport', 'Shopping', 'Utilities', 'Work'];

export default function AddTransactionModal({ isOpen, onClose, onSubmit }: AddTransactionModalProps) {
  const [formData, setFormData] = useState<TransactionData>({
    type: 'Expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleTypeChange = (type: 'Income' | 'Expense') => {
    setFormData({ ...formData, type });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, amount: e.target.value });
  };

  const handleCategoryClick = (category: string) => {
    setFormData({ ...formData, category });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date: e.target.value });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, notes: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      type: 'Expense',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  if (!isOpen) return null;

  return (
  <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-6">Record your daily expense to keep your flow accurate</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Entry Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">ENTRY TYPE</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('Income')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  formData.type === 'Income'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
              >
                + Income
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('Expense')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  formData.type === 'Expense'
                    ? 'bg-red-500 text-white border border-red-500'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
              >
                - Expense
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">AMOUNT</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-black">$</span>
              <input
                type="number"
                value={formData.amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                step="0.01"
                className="w-full pl-8 pr-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Quick Select Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">QUICK SELECT CATEGORY</label>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                    formData.category === cat
                      ? 'bg-blue-500 text-white'
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

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">NOTES (OPTIONAL)</label>
            <textarea
              value={formData.notes}
              onChange={handleNotesChange}
              placeholder="What was this for? (e.g. Weekly shop, Coffee with Sarah...)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
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
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}