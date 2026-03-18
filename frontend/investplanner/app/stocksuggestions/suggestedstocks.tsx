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

const SAMPLE_STOCKS: Stock[] = [
  {
    id: '1',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 3850.75,
    change: 125.50,
    changePercent: 3.37,
  },
  {
    id: '2',
    symbol: 'INFY',
    name: 'Infosys Limited',
    price: 1650.25,
    change: 45.75,
    changePercent: 2.84,
  },
  {
    id: '3',
    symbol: 'HDFC',
    name: 'HDFC Bank Limited',
    price: 1920.40,
    change: 52.30,
    changePercent: 2.79,
  },
  {
    id: '4',
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Limited',
    price: 1125.60,
    change: 35.20,
    changePercent: 3.23,
  },
  {
    id: '5',
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    price: 2825.85,
    change: 78.45,
    changePercent: 2.86,
  },
  {
    id: '6',
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Limited',
    price: 945.30,
    change: 28.50,
    changePercent: 3.11,
  },
  {
    id: '7',
    symbol: 'LT',
    name: 'Larsen & Toubro',
    price: 3215.75,
    change: 92.20,
    changePercent: 2.95,
  },
  {
    id: '8',
    symbol: 'WIPRO',
    name: 'Wipro Limited',
    price: 545.20,
    change: 15.85,
    changePercent: 3.01,
  },
];

export default function SuggestedStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch('/api/stocks');
        const data = await response.json();
        setStocks(data);
      } catch (error) {
        console.error('Failed to fetch stocks:', error);
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
    <div className="bg-white rounded-lg p-6 shadow-sm w-full">
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
                <p className="text-lg font-bold text-gray-800">₹{stock.price.toFixed(2)}</p>
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