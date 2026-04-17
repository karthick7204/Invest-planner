"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockFilter = StockFilter;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
function StockFilter({ onFilterChange }) {
    const [min, setMin] = (0, react_1.useState)('');
    const [max, setMax] = (0, react_1.useState)('');
    // Auto apply debounced
    (0, react_1.useEffect)(() => {
        const handler = setTimeout(() => {
            onFilterChange(Number(min) || 0, Number(max) || Infinity);
        }, 400);
        return () => clearTimeout(handler);
    }, [min, max, onFilterChange]);
    const handleReset = () => {
        setMin('');
        setMax('');
    };
    const preventInvalidChars = (e) => {
        if (['-', '+', 'e', 'E'].includes(e.key)) {
            e.preventDefault();
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "mb-6 w-full", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-indigo-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { size: 20, className: "stroke-[2.2]" }), (0, jsx_runtime_1.jsx)("span", { className: "font-bold text-sm tracking-wide uppercase", children: "Filter Range" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 flex-wrap", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative group", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.IndianRupee, { size: 16 }) }), (0, jsx_runtime_1.jsx)("input", { type: "number", min: "0", value: min, onKeyDown: preventInvalidChars, onChange: (e) => setMin(e.target.value === '' ? '' : Number(e.target.value)), className: "pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm w-32 md:w-40 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 text-gray-800 transition-all font-medium placeholder:font-normal placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", placeholder: "Min Price" })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-300 font-medium", children: "\u2014" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative group", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.IndianRupee, { size: 16 }) }), (0, jsx_runtime_1.jsx)("input", { type: "number", min: "0", value: max, onKeyDown: preventInvalidChars, onChange: (e) => setMax(e.target.value === '' ? '' : Number(e.target.value)), className: "pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm w-32 md:w-40 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 text-gray-800 transition-all font-medium placeholder:font-normal placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", placeholder: "Max Price" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end w-full sm:w-auto h-10", children: (min !== '' || max !== '') && ((0, jsx_runtime_1.jsxs)("button", { onClick: handleReset, className: "flex items-center justify-center gap-2 px-4 py-2 h-full text-sm font-medium text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors ml-0 sm:ml-2", title: "Reset Filters", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RotateCcw, { size: 16 }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: "Reset" })] })) })] })] }) }));
}
//# sourceMappingURL=StockFilter.js.map