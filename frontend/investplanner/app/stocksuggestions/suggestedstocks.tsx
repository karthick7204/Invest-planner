'use client';

import React, { useState, useEffect } from 'react';
import { apiCall } from '../lib/api';
import { StockFilter } from '../components/StockFilter';

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
          const processedStocks = data.stockList.map((s: any) => {
            const rawPrice = s.lastprice ?? s.lastPrice;
            const priceVal = typeof rawPrice === 'string' 
              ? Number(rawPrice.replace(/,/g, '')) 
              : Number(rawPrice);
              
            return {
              symbol: s.symbol,
              lastprice: isNaN(priceVal) ? 0 : priceVal
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

  const handleFilterChange = React.useCallback((min: number, max: number) => {
    const minVal = isNaN(min) ? 0 : min;
    const maxVal = isNaN(max) ? Infinity : max;

    const filtered = stocks.filter(
      (stock) => stock.lastprice >= minVal && stock.lastprice <= maxVal
    );
    setFilteredStocks(filtered);
  }, [stocks]);

  if (loading) {
    return <div className="text-center p-4">Loading stocks...</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Recommended Stocks</h2>
        <p className="text-gray-500 text-sm mt-1">Investment suggestions based on your profile</p>
      </div>

      <StockFilter onFilterChange={handleFilterChange} />

      {/* Stock List */}
      <div className="space-y-3">
        {filteredStocks.length === 0 ? (
          <p className="text-center text-gray-500">No stock suggestions available for this range</p>
        ) : (
          filteredStocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer"
            >
              {/* Left - Stock Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{stock.symbol}</h3>
              </div>

              {/* Right - Price */}
              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">
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