'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CategoryBreakdown;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const api_1 = require("../lib/api");
function CategoryBreakdown({ range }) {
    const [selectedMonth, setSelectedMonth] = (0, react_1.useState)(new Date().getMonth());
    const [selectedYear, setSelectedYear] = (0, react_1.useState)(new Date().getFullYear());
    const [showDropdown, setShowDropdown] = (0, react_1.useState)(false);
    const [categoryData, setCategoryData] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
    const displayDate = `${months[selectedMonth]} ${selectedYear}`;
    (0, react_1.useEffect)(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // month + 1 because selectedMonth is 0-indexed
                const data = await (0, api_1.apiCall)(`/expense/category-breakdown?range=${range}&month=${selectedMonth + 1}&year=${selectedYear}`);
                if (data && data.breakdown) {
                    setCategoryData(data.breakdown);
                }
            }
            catch (error) {
                console.error("Error fetching category breakdown:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [range, selectedMonth, selectedYear]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-6 shadow-sm min-h-[400px]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-800", children: "Category Breakdown" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setShowDropdown(!showDropdown), className: "flex items-center gap-2 text-black cursor-pointer hover:text-gray-600 font-medium transition", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5 flex-shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), (0, jsx_runtime_1.jsx)("span", { className: "whitespace-nowrap", children: displayDate })] }), showDropdown && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 w-64 animate-in fade-in slide-in-from-top-2 duration-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider text-[10px]", children: "Month" }), (0, jsx_runtime_1.jsx)("select", { value: selectedMonth, onChange: (e) => setSelectedMonth(parseInt(e.target.value)), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm", children: months.map((month, index) => ((0, jsx_runtime_1.jsx)("option", { value: index, children: month }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider text-[10px]", children: "Year" }), (0, jsx_runtime_1.jsx)("select", { value: selectedYear, onChange: (e) => setSelectedYear(parseInt(e.target.value)), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm", children: years.map((year) => ((0, jsx_runtime_1.jsx)("option", { value: year, children: year }, year))) })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowDropdown(false), className: "w-full bg-black hover:bg-gray-800 text-white py-2 rounded-lg font-medium transition text-sm", children: "Done" })] }))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 text-gray-400 font-black text-[10px] tracking-widest uppercase", children: "Category" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 text-gray-400 font-black text-[10px] tracking-widest uppercase", children: "Amount Spent" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 text-gray-400 font-black text-[10px] tracking-widest uppercase", children: "% of Income" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: loading ? ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsxs)("td", { colSpan: 3, className: "py-20 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "inline-block w-8 h-8 border-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-gray-500 font-medium", children: "Loading report..." })] }) })) : categoryData.length > 0 ? (categoryData.map((item) => ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-50 hover:bg-gray-50/50 transition-colors", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-5 px-4", children: (0, jsx_runtime_1.jsx)("span", { className: "text-gray-900 font-bold", children: item.category }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-5 px-4", children: (0, jsx_runtime_1.jsx)("span", { className: "text-gray-900 font-bold text-lg", children: item.amountSpent }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-5 px-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-gray-900 font-bold w-10 text-sm", children: [item.percentageOfSalary, "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "w-48 bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200/50", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-yellow-400 h-full rounded-full transition-all duration-700 ease-out shadow-sm", style: { width: `${Math.min(100, item.percentageOfSalary)}%` } }) })] }) })] }, item.id)))) : ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: 3, className: "py-20 text-center", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 font-medium", children: "No transaction data found for this period." }) }) })) })] }) })] }));
}
//# sourceMappingURL=categoryBreakdown.js.map