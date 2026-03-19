'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SuggestedStocks;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SAMPLE_STOCKS = [
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
function SuggestedStocks() {
    const [stocks, setStocks] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const fetchStocks = async () => {
            try {
                const response = await fetch('/api/stocks');
                const data = await response.json();
                setStocks(data);
            }
            catch (error) {
                console.error('Failed to fetch stocks:', error);
                setStocks(SAMPLE_STOCKS);
            }
            finally {
                setLoading(false);
            }
        };
        fetchStocks();
    }, []);
    if (loading) {
        return (0, jsx_runtime_1.jsx)("div", { className: "text-center p-4", children: "Loading stocks..." });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-6 shadow-sm w-full", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-800", children: "Recommended Stocks" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 text-sm mt-1", children: "Investment suggestions for you" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: stocks.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-center text-gray-500", children: "No stocks available" })) : (stocks.map((stock) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-800", children: stock.symbol }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: stock.name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-lg font-bold text-gray-800", children: ["\u20B9", stock.price.toFixed(2)] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm font-semibold text-green-600", children: [stock.change >= 0 ? '+' : '', stock.changePercent.toFixed(2), "%"] })] })] }, stock.id)))) })] }));
}
//# sourceMappingURL=suggestedstocks.js.map