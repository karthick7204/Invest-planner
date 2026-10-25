'use client';

import React, { useState, useEffect } from 'react';
import { apiCall } from '../lib/api';
import { StockFilter } from '../components/StockFilter';
import { TrendingUp } from 'lucide-react';

interface Stock {
  symbol: string;
  lastprice: number;
}

export default function SuggestedStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await apiCall('/stocks/displaystocks');
        if (data && data.stockList) {
          const processedStocks = data.stockList.map((s: { lastprice?: number | string; lastPrice?: number | string; symbol: string }) => {
            const rawPrice = s.lastprice ?? s.lastPrice;
            const priceVal =
              typeof rawPrice === 'string'
                ? Number(rawPrice.replace(/,/g, ''))
                : Number(rawPrice);

            return {
              symbol: s.symbol,
              lastprice: isNaN(priceVal) ? 0 : priceVal,
            };
          });
          setStocks(processedStocks);
          setFilteredStocks(processedStocks);
        } else {
          setStocks([]);
          setFilteredStocks([]);
        }
      } catch (error) {
        console.error('Failed to fetch stocks:', error);
        setStocks([]);
        setFilteredStocks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const handleFilterChange = React.useCallback(
    (min: number, max: number) => {
      const minVal = isNaN(min) ? 0 : min;
      const maxVal = isNaN(max) ? Infinity : max;

      const filtered = stocks.filter(
        (stock) => stock.lastprice >= minVal && stock.lastprice <= maxVal
      );
      setFilteredStocks(filtered);
    },
    [stocks]
  );

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl p-12 border border-neutral-200/90 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-7 h-7 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
        <p className="font-mono text-xs text-neutral-400">Loading quantitative signals...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-sm w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-950 tracking-tight">
          Recommended Equities
        </h2>
        <p className="font-mono text-xs text-neutral-400 mt-0.5">
          Autonomous capital allocation candidates based on current liquidity
        </p>
      </div>

      <StockFilter onFilterChange={handleFilterChange} />

      {/* Stock Grid / List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredStocks.length === 0 ? (
          <div className="col-span-full py-12 text-center text-neutral-400 font-mono text-xs border border-dashed border-neutral-200 rounded-xl">
            No stock candidates available for this price filter
          </div>
        ) : (
          filteredStocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex justify-between items-center p-4 bg-neutral-50/60 border border-neutral-200/80 rounded-xl hover:border-neutral-900 hover:bg-white transition cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 group-hover:bg-black group-hover:text-white transition-colors">
                  <TrendingUp size={13} />
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-neutral-950 font-sans tracking-tight">
                    {stock.symbol}
                  </h3>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                    NSE Live
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="font-mono text-xs font-semibold text-neutral-950">
                  ₹{stock.lastprice.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}