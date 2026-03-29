'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const recharts_1 = require("recharts");
const DEFAULT_DATA = [
    { day: 'Mon', expenses: 925 },
    { day: 'Tue', expenses: 950 },
    { day: 'Wed', expenses: 1075 },
    { day: 'Thu', expenses: 775 },
    { day: 'Fri', expenses: 1075 },
    { day: 'Sat', expenses: 825 },
    { day: 'Sun', expenses: 725 },
];
const IncomeExpensesChart = ({ data = DEFAULT_DATA, title = 'Expense Analysis', height = 400, dataKey = "day", }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full bg-white rounded-xl", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: height, children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: data, margin: { top: 20, right: 10, left: 10, bottom: 20 }, barCategoryGap: "20%", children: [(0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("linearGradient", { id: "expenseGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: "#f59e0b", stopOpacity: 1 }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: "#d97706", stopOpacity: 0.8 })] }) }), (0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0", vertical: false }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: dataKey, tick: { fill: '#94a3b8', fontSize: 12 }, axisLine: false, tickLine: false }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { tick: { fill: '#94a3b8', fontSize: 12 }, axisLine: false, tickLine: false, tickFormatter: (value) => `₹${value}` }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { contentStyle: {
                            backgroundColor: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            padding: '12px'
                        }, cursor: { fill: '#f8fafc' }, formatter: (value) => [`₹${(Number(value) || 0).toLocaleString()}`, 'Expenses'] }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "expenses", fill: "url(#expenseGradient)", name: "Expenses", radius: [6, 6, 0, 0], barSize: data.length > 10 ? undefined : 45 })] }) }) }));
};
exports.default = IncomeExpensesChart;
//# sourceMappingURL=graphChart.js.map