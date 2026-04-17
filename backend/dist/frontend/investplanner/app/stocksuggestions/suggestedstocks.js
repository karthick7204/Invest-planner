'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SuggestedStocks;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const api_1 = require("../lib/api");
const StockFilter_1 = require("../components/StockFilter");
function SuggestedStocks() {
    const [stocks, setStocks] = (0, react_1.useState)([]);
    const [filteredStocks, setFilteredStocks] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const fetchStocks = async () => {
            try {
                const data = await (0, api_1.apiCall)('/stocks/displaystocks');
                if (data && data.stockList) {
                    const processedStocks = data.stockList.map((s) => {
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
                }
                else {
                    setStocks([]);
                    setFilteredStocks([]);
                }
            }
            catch (error) {
                console.error('Failed to fetch stocks:', error);
                setStocks([]);
                setFilteredStocks([]);
            }
            finally {
                setLoading(false);
            }
        };
        fetchStocks();
    }, []);
    const handleFilterChange = react_1.default.useCallback((min, max) => {
        const minVal = isNaN(min) ? 0 : min;
        const maxVal = isNaN(max) ? Infinity : max;
        const filtered = stocks.filter((stock) => stock.lastprice >= minVal && stock.lastprice <= maxVal);
        setFilteredStocks(filtered);
    }, [stocks]);
    if (loading) {
        return (0, jsx_runtime_1.jsx)("div", { className: "text-center p-4", children: "Loading stocks..." });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-6 shadow-sm w-full", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-800", children: "Recommended Stocks" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 text-sm mt-1", children: "Investment suggestions based on your profile" })] }), (0, jsx_runtime_1.jsx)(StockFilter_1.StockFilter, { onFilterChange: handleFilterChange }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: filteredStocks.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-center text-gray-500", children: "No stock suggestions available for this range" })) : (filteredStocks.map((stock) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer", children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-800", children: stock.symbol }) }), (0, jsx_runtime_1.jsx)("div", { className: "text-right", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-lg font-bold text-gray-800", children: ["\u20B9", stock.lastprice.toFixed(2)] }) })] }, stock.symbol)))) })] }));
}
//# sourceMappingURL=suggestedstocks.js.map