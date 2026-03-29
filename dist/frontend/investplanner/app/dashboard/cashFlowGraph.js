"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashFlowGraph = CashFlowGraph;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const graphChart_1 = __importDefault(require("../components/graphChart"));
const api_1 = require("../lib/api");
const lucide_react_1 = require("lucide-react");
function CashFlowGraph() {
    const [graphData, setGraphData] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [filterMode, setFilterMode] = (0, react_1.useState)('daily');
    const fetchGraphData = async (mode) => {
        setLoading(true);
        try {
            const response = await (0, api_1.apiCall)(`/expense/graphdata?mode=${mode}`);
            if (response && response.graphData) {
                setGraphData(response.graphData);
            }
        }
        catch (error) {
            console.error("Failed to fetch graph data:", error);
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchGraphData(filterMode);
        // Re-fetch when a new transaction is added
        const handleTransactionAdded = () => fetchGraphData(filterMode);
        if (typeof window !== 'undefined') {
            window.addEventListener('transactionAdded', handleTransactionAdded);
            return () => window.removeEventListener('transactionAdded', handleTransactionAdded);
        }
    }, [filterMode]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-slate-800 flex items-center gap-2", children: "Expense Statistics" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500 mt-1", children: filterMode === 'daily' ? "Trends from the last 30 days" : "Today's expenses by category" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { size: 10 }), "Show View"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl self-start border border-slate-100", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setFilterMode('daily'), className: `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${filterMode === 'daily'
                                            ? "bg-white text-amber-600 shadow-sm border border-amber-100"
                                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"}`, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { size: 16 }), "Daily History"] }), (0, jsx_runtime_1.jsxs)("button", { id: "category-filter-btn", onClick: () => setFilterMode('category'), className: `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${filterMode === 'category'
                                            ? "bg-white text-amber-600 shadow-sm border border-amber-100"
                                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"}`, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.PieChart, { size: 16 }), "Today's Categories"] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full h-[350px] md:h-[400px] flex items-center justify-center relative", children: loading ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-400 font-medium", children: "Analyzing data..." })] })) : graphData.length > 0 ? ((0, jsx_runtime_1.jsx)(graphChart_1.default, { data: graphData, dataKey: filterMode === 'daily' ? "day" : "name" })) : ((0, jsx_runtime_1.jsxs)("div", { className: "text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl p-12 flex flex-col items-center justify-center w-full h-full gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { size: 32, className: "text-slate-200" }), (0, jsx_runtime_1.jsx)("p", { className: "font-medium", children: "No expenses recorded for this view" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-400", children: "Try adding a new transaction to see results here." })] })) })] }));
}
//# sourceMappingURL=cashFlowGraph.js.map