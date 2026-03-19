'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReportGraph;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const recharts_1 = require("recharts");
const SPENDING_DATA = [
    { category: 'Housing', budget: 2200, spending: 2100 },
    { category: 'Food & Dining', budget: 950, spending: 850 },
    { category: 'Transport', budget: 400, spending: 350 },
    { category: 'Entertainment', budget: 500, spending: 450 },
    { category: 'Utilities', budget: 300, spending: 280 },
];
function ReportGraph() {
    const [selectedMonth, setSelectedMonth] = (0, react_1.useState)(new Date().getMonth());
    const [selectedYear, setSelectedYear] = (0, react_1.useState)(new Date().getFullYear());
    const [showDropdown, setShowDropdown] = (0, react_1.useState)(false);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
    const displayDate = `${months[selectedMonth]} ${selectedYear}`;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-6 shadow-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-start mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-800", children: "Spending vs. Budget" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 text-sm mt-1", children: "Visual breakdown of allocation efficiency per category" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setShowDropdown(!showDropdown), className: "flex items-center gap-2 text-blue-500 hover:text-blue-700 font-medium transition", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), displayDate] }), showDropdown && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 w-48", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Month" }), (0, jsx_runtime_1.jsx)("select", { value: selectedMonth, onChange: (e) => setSelectedMonth(parseInt(e.target.value)), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: months.map((month, index) => ((0, jsx_runtime_1.jsx)("option", { value: index, children: month }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Year" }), (0, jsx_runtime_1.jsx)("select", { value: selectedYear, onChange: (e) => setSelectedYear(parseInt(e.target.value)), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: years.map((year) => ((0, jsx_runtime_1.jsx)("option", { value: year, children: year }, year))) })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowDropdown(false), className: "w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition", children: "Done" })] }))] })] }), (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 350, children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: SPENDING_DATA, margin: { top: 20, right: 30, left: 0, bottom: 20 }, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb", vertical: false }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "category", tick: { fill: '#6b7280', fontSize: 12 }, axisLine: { stroke: '#e5e7eb' } }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { tick: { fill: '#6b7280', fontSize: 12 }, axisLine: { stroke: '#e5e7eb' } }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { contentStyle: {
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            }, cursor: { fill: 'rgba(0, 0, 0, 0.05)' } }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "budget", fill: "#e5e7eb", radius: [4, 4, 0, 0], name: "Budget" }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "spending", fill: "#facc15", radius: [4, 4, 0, 0], name: "Spending" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-center gap-8 mt-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 bg-gray-300 rounded" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600 text-sm", children: "Budget" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 bg-yellow-400 rounded" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600 text-sm", children: "Spending" })] })] })] }));
}
//# sourceMappingURL=reportGraph.js.map