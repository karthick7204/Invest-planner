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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RecentTransaction;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const addTransaction_1 = __importDefault(require("../modals/addTransaction"));
const api_1 = require("../lib/api");
const lucide_react_1 = require("lucide-react");
const TableRows = react_1.default.memo(({ items, onDelete }) => ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: items.map((transaction) => ((0, jsx_runtime_1.jsxs)("tr", { className: "group border-b border-gray-100 hover:bg-gray-50/80 transition-colors", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${transaction.isExpense ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`, children: transaction.initials }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-col", children: (0, jsx_runtime_1.jsx)("span", { className: "text-gray-900 font-bold", children: transaction.merchant }) })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4", children: (0, jsx_runtime_1.jsx)("span", { className: "px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wider", children: transaction.category }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4 text-gray-500 text-sm font-medium", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4 opacity-50", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), transaction.date] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end gap-6", children: [(0, jsx_runtime_1.jsx)("span", { className: `font-black text-lg ${transaction.isExpense ? 'text-gray-900' : 'text-green-600'}`, children: transaction.amount }), (0, jsx_runtime_1.jsx)("button", { onClick: () => onDelete(transaction.id), className: "opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all transform hover:scale-110", title: "Delete transaction", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { size: 18 }) })] }) })] }, transaction.id))) })));
TableRows.displayName = 'TableRows';
const Pagination = react_1.default.memo(({ totalPages, currentPage, onPageChange }) => ((0, jsx_runtime_1.jsxs)("div", { className: "mt-8 flex justify-center items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => onPageChange(currentPage - 1), disabled: currentPage === 1, className: "px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2 transition", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), "Prev"] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-1", children: Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => onPageChange(page), className: `w-10 h-10 rounded-xl font-black text-sm transition ${currentPage === page
                    ? 'bg-black text-white shadow-lg shadow-gray-200'
                    : 'text-gray-400 hover:bg-gray-50'}`, children: page }, page))) }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => onPageChange(currentPage + 1), disabled: currentPage === totalPages, className: "px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2 transition", children: ["Next", (0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] })] })));
Pagination.displayName = 'Pagination';
function RecentTransaction() {
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const [showAll, setShowAll] = (0, react_1.useState)(false);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [transactionsData, setTransactionsData] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const fetchTransactions = async () => {
        try {
            const data = await (0, api_1.apiCall)('/expense/transactions?limit=50');
            if (data && data.transactions) {
                const mappedData = data.transactions.map((t) => ({
                    id: t._id,
                    merchant: t.topic || 'Unknown',
                    initials: (t.topic || '?').charAt(0).toUpperCase(),
                    category: t.category,
                    date: new Date(t.date).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                    }),
                    status: 'Completed',
                    amount: t.type === 'expense' ? `-₹${t.amount.toLocaleString()}` : `+₹${t.amount.toLocaleString()}`,
                    isExpense: t.type === 'expense'
                }));
                setTransactionsData(mappedData);
            }
        }
        catch (error) {
            console.error("Failed to fetch transactions:", error);
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchTransactions();
        // Listen for transaction added events from other components
        if (typeof window !== 'undefined') {
            window.addEventListener('transactionAdded', fetchTransactions);
            return () => window.removeEventListener('transactionAdded', fetchTransactions);
        }
    }, []);
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this transaction?'))
            return;
        try {
            await (0, api_1.apiCall)(`/expense/transaction/${id}`, { method: 'DELETE' });
            // Notify other components for real-time updates (like surplus card)
            handleTransactionAdded();
        }
        catch (error) {
            alert('Failed to delete transaction. Please try again.');
            console.error("Delete error:", error);
        }
    };
    const itemsPerPage = 8;
    const paginatedItems = showAll
        ? transactionsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : transactionsData.slice(0, 5);
    const totalPages = Math.max(1, Math.ceil(transactionsData.length / itemsPerPage));
    const handleViewAll = (0, react_1.useCallback)(() => {
        setShowAll(true);
        setCurrentPage(1);
    }, []);
    const handleViewLess = (0, react_1.useCallback)(() => {
        setShowAll(false);
        setCurrentPage(1);
    }, []);
    const handlePageChange = (0, react_1.useCallback)((page) => {
        setCurrentPage(page);
    }, []);
    const handleTransactionAdded = () => {
        fetchTransactions();
        typeof window !== 'undefined' && window.dispatchEvent(new Event('transactionAdded'));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-4 sm:p-8 flex flex-col w-full min-h-[500px] sm:min-h-[600px] transition-all duration-300", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-1", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl sm:text-3xl font-black text-gray-900 tracking-tight", children: "Recent Activity" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-xs sm:text-sm font-medium", children: "Manage your daily transactions" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: showAll ? handleViewLess : handleViewAll, className: "w-full sm:w-auto px-4 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 font-bold transition flex items-center justify-center gap-2 border border-gray-100 text-sm", children: [showAll ? 'Collapse' : 'Manage All', (0, jsx_runtime_1.jsx)("svg", { className: `w-4 h-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "w-full flex-grow overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "hidden md:block", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-100", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left py-4 px-4 text-gray-400 font-bold text-[10px] tracking-widest uppercase", children: "Merchant / Service" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-4 px-4 text-gray-400 font-bold text-[10px] tracking-widest uppercase", children: "Category" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-4 px-4 text-gray-400 font-bold text-[10px] tracking-widest uppercase", children: "Date" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right py-4 px-4 text-gray-400 font-bold text-[10px] tracking-widest uppercase", children: "Amount" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-gray-50", children: loading ? ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsxs)("td", { colSpan: 4, className: "py-20 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "inline-block w-8 h-8 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-4 text-gray-400 font-bold text-sm", children: "Syncing transactions..." })] }) })) : paginatedItems.length > 0 ? ((0, jsx_runtime_1.jsx)(TableRows, { items: paginatedItems, onDelete: handleDelete })) : ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: 4, className: "py-20 text-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-3 text-gray-300", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { size: 48, strokeWidth: 1 }), (0, jsx_runtime_1.jsx)("p", { className: "font-bold text-lg", children: "No transactions found" })] }) }) })) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "md:hidden space-y-4", children: loading ? ((0, jsx_runtime_1.jsxs)("div", { className: "py-20 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "inline-block w-8 h-8 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-4 text-gray-400 font-bold text-sm", children: "Syncing transactions..." })] })) : paginatedItems.length > 0 ? (paginatedItems.map((transaction) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-50/50 rounded-2xl border border-gray-100 relative group", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mb-3", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm ${transaction.isExpense ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`, children: transaction.initials }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col min-w-0 flex-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-900 font-bold truncate", children: transaction.merchant }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest", children: transaction.category })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: `font-black text-lg ${transaction.isExpense ? 'text-gray-900' : 'text-green-600'}`, children: transaction.amount }), (0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-gray-400 font-medium", children: transaction.date })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleDelete(transaction.id), className: "absolute -top-2 -right-2 bg-white p-2 text-gray-400 hover:text-red-500 rounded-full shadow-md border border-gray-100 transition-all active:scale-95", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { size: 14 }) })] }, transaction.id)))) : ((0, jsx_runtime_1.jsxs)("div", { className: "py-20 text-center flex flex-col items-center gap-3 text-gray-300", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { size: 48, strokeWidth: 1 }), (0, jsx_runtime_1.jsx)("p", { className: "font-bold text-lg", children: "No transactions found" })] })) })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-auto pt-8 border-t border-gray-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1 w-full order-2 sm:order-1", children: showAll && transactionsData.length > 0 && ((0, jsx_runtime_1.jsx)(Pagination, { totalPages: totalPages, currentPage: currentPage, onPageChange: handlePageChange })) }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsModalOpen(true), className: "w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition shadow-xl shadow-gray-200 order-1 sm:order-2 active:scale-95", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 rounded-full bg-white/20 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: "+" }) }), "Quick Add"] })] }) }), (0, jsx_runtime_1.jsx)(addTransaction_1.default, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), onTransactionAdded: handleTransactionAdded })] }));
}
//# sourceMappingURL=recentTransactions.js.map