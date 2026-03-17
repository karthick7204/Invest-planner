'use client';

import React, { useState, useEffect } from 'react';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

// Sample data
const SAMPLE_STOCKS: Stock[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 182.52,
    change: 5.23,
    changePercent: 2.95,
  },
  {
    id: '2',
    symbol: 'MSFT',
    name: 'Microsoft',
    price: 424.68,
    change: 8.75,
    changePercent: 2.10,
  },
  {
    id: '3',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 139.85,
    change: 4.20,
    changePercent: 3.10,
  },
  {
    id: '4',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 195.75,
    change: 3.50,
    changePercent: 1.82,
  },
  {
    id: '5',
    symbol: 'NVDA',
    name: 'NVIDIA',
    price: 875.32,
    change: 12.45,
    changePercent: 1.44,
  },
 
];

export default function SuggestedStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stocks from your backend
    const fetchStocks = async () => {
      try {
        const response = await fetch('/api/stocks'); // Your backend API
        const data = await response.json();
        setStocks(data);
      } catch (error) {
        console.error('Failed to fetch stocks:', error);
        // Use sample data if fetch fails
        setStocks(SAMPLE_STOCKS);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading stocks...</div>;
  }

  return (
    <div className="bg-white absolute left-62 w-[1100px] rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Recommended Stocks</h2>
        <p className="text-gray-500 text-sm mt-1">Investment suggestions for you</p>
      </div>

      {/* Stock List */}
      <div className="space-y-3">
        {stocks.length === 0 ? (
          <p className="text-center text-gray-500">No stocks available</p>
        ) : (
          stocks.map((stock) => (
            <div
              key={stock.id}
              className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer"
            >
              {/* Left - Stock Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{stock.symbol}</h3>
                <p className="text-sm text-gray-500">{stock.name}</p>
              </div>

              {/* Right - Price & Change */}
              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">${stock.price.toFixed(2)}</p>
                <p className="text-sm font-semibold text-green-600">
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}