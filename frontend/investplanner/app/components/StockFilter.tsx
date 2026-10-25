'use client';

import React, { useState, useEffect } from 'react';
import { Filter, RotateCcw, IndianRupee } from 'lucide-react';

interface StockFilterProps {
  onFilterChange: (min: number, max: number) => void;
}

export function StockFilter({ onFilterChange }: StockFilterProps) {
  const [min, setMin] = useState<number | ''>('');
  const [max, setMax] = useState<number | ''>('');

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-2xl border border-neutral-200/90 shadow-sm gap-4">
        <div className="flex items-center gap-2 text-neutral-900">
          <Filter size={16} />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider">
            Price Range Filter
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
              <IndianRupee size={13} />
            </div>
            <input
              type="number"
              min="0"
              value={min}
              onKeyDown={preventInvalidChars}
              onChange={(e) => setMin(e.target.value === '' ? '' : Number(e.target.value))}
              className="pl-8 pr-3 py-2 bg-neutral-50/70 border border-neutral-200 rounded-lg text-xs w-28 sm:w-32 outline-none focus:border-neutral-900 focus:bg-white text-neutral-900 font-mono transition"
              placeholder="Min Price"
            />
          </div>

          <span className="text-neutral-300 font-mono text-xs">—</span>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
              <IndianRupee size={13} />
            </div>
            <input
              type="number"
              min="0"
              value={max}
              onKeyDown={preventInvalidChars}
              onChange={(e) => setMax(e.target.value === '' ? '' : Number(e.target.value))}
              className="pl-8 pr-3 py-2 bg-neutral-50/70 border border-neutral-200 rounded-lg text-xs w-28 sm:w-32 outline-none focus:border-neutral-900 focus:bg-white text-neutral-900 font-mono transition"
              placeholder="Max Price"
            />
          </div>

          {(min !== '' || max !== '') && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-lg transition cursor-pointer"
              title="Reset Filters"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
