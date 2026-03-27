"use client"
import React, { useState, useEffect } from 'react';
import { Filter, RotateCcw, IndianRupee } from 'lucide-react';

interface StockFilterProps {
  onFilterChange: (min: number, max: number) => void;
}

export function StockFilter({ onFilterChange }: StockFilterProps) {
  const [min, setMin] = useState<number | ''>('');
  const [max, setMax] = useState<number | ''>('');

  // Auto apply debounced
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange(Number(min) || 0, Number(max) || Infinity);
    }, 400);
    return () => clearTimeout(handler);
  }, [min, max, onFilterChange]);

  const handleReset = () => {
    setMin('');
    setMax('');
  };

  const preventInvalidChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['-', '+', 'e', 'E'].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="mb-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md gap-4">
        
        <div className="flex items-center gap-2 text-indigo-600">
          <Filter size={20} className="stroke-[2.2]" />
          <span className="font-bold text-sm tracking-wide uppercase">Filter Range</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
              <IndianRupee size={16} />
            </div>
            <input 
              type="number" 
              min="0"
              value={min} 
              onKeyDown={preventInvalidChars}
              onChange={(e) => setMin(e.target.value === '' ? '' : Number(e.target.value))} 
              className="pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm w-32 md:w-40 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 text-gray-800 transition-all font-medium placeholder:font-normal placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Min Price"
            />
          </div>
          
          <span className="text-gray-300 font-medium">—</span>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
              <IndianRupee size={16} />
            </div>
            <input 
              type="number" 
              min="0"
              value={max} 
              onKeyDown={preventInvalidChars}
              onChange={(e) => setMax(e.target.value === '' ? '' : Number(e.target.value))} 
              className="pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm w-32 md:w-40 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 text-gray-800 transition-all font-medium placeholder:font-normal placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Max Price"
            />
          </div>
          
          <div className="flex justify-end w-full sm:w-auto h-10">
            {(min !== '' || max !== '') && (
              <button 
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-4 py-2 h-full text-sm font-medium text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors ml-0 sm:ml-2"
                title="Reset Filters"
              >
                <RotateCcw size={16} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
