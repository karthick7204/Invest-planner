'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const recharts_1 = require("recharts");
const DEFAULT_DATA = [
    { day: 'Mon', income: 1050, expenses: 925 },
    { day: 'Tue', income: 1075, expenses: 950 },
    { day: 'Wed', income: 1050, expenses: 1075 },
    { day: 'Thu', income: 1600, expenses: 775 },
    { day: 'Fri', income: 1700, expenses: 1075 },
    { day: 'Sat', income: 1000, expenses: 825 },
    { day: 'Sun', income: 975, expenses: 725 },
];
const IncomeExpensesChart = ({ data = DEFAULT_DATA, title = 'Income vs Expenses', height = 400, }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-5xl w-4xl h-125 bg-white rounded-lg p-25 shadow-sm", children: [title && ((0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-800 mb-6", children: title })), (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: height, children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: data, margin: { top: 20, right: 30, left: 0, bottom: 20 }, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "day", tick: { fill: '#6b7280', fontSize: 13 }, axisLine: { stroke: '#e5e7eb' } }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { tick: { fill: '#6b7280', fontSize: 13 }, axisLine: { stroke: '#e5e7eb' } }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { contentStyle: {
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            }, cursor: { fill: 'rgba(0, 0, 0, 0.05)' } }), (0, jsx_runtime_1.jsx)(recharts_1.Legend, { wrapperStyle: { paddingTop: '20px' }, iconType: "circle" }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "income", fill: "#1f2928", name: "Income", radius: [4, 4, 0, 0] }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "expenses", fill: "#f59e0b", name: "Expenses", radius: [4, 4, 0, 0] })] }) })] }));
};
exports.default = IncomeExpensesChart;
//# sourceMappingURL=graphChart.js.map