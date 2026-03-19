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
const SAMPLE_TRANSACTIONS = [
    { id: '1', merchant: 'Apple Store', initials: 'A', category: 'Electronics', date: 'Oct 24, 2024', status: 'Completed', amount: '-₹1,299.00', isExpense: true },
    { id: '2', merchant: 'Monthly Salary', initials: 'M', category: 'Income', date: 'Oct 23, 2024', status: 'Completed', amount: '+₹4,500.00', isExpense: false },
    { id: '3', merchant: 'Whole Foods', initials: 'W', category: 'Groceries', date: 'Oct 22, 2024', status: 'Pending', amount: '-₹124.50', isExpense: true },
    { id: '4', merchant: 'Shell Gas Station', initials: 'S', category: 'Transport', date: 'Oct 21, 2024', status: 'Completed', amount: '-₹65.00', isExpense: true },
    { id: '5', merchant: 'Netflix Subscription', initials: 'N', category: 'Entertainment', date: 'Oct 20, 2024', status: 'Completed', amount: '-₹15.99', isExpense: true },
    { id: '6', merchant: 'Uber Ride', initials: 'U', category: 'Transport', date: 'Oct 19, 2024', status: 'Completed', amount: '-₹32.50', isExpense: true },
    { id: '7', merchant: 'Starbucks', initials: 'S', category: 'Food & Drink', date: 'Oct 18, 2024', status: 'Completed', amount: '-₹6.75', isExpense: true },
    { id: '8', merchant: 'Amazon Purchase', initials: 'A', category: 'Shopping', date: 'Oct 17, 2024', status: 'Pending', amount: '-₹89.99', isExpense: true },
    { id: '9', merchant: 'Gym Membership', initials: 'G', category: 'Health', date: 'Oct 16, 2024', status: 'Completed', amount: '-₹50.00', isExpense: true },
    { id: '10', merchant: 'Restaurant Dinner', initials: 'R', category: 'Dining', date: 'Oct 15, 2024', status: 'Completed', amount: '-₹72.30', isExpense: true },
    { id: '11', merchant: 'Freelance Project', initials: 'F', category: 'Income', date: 'Oct 14, 2024', status: 'Completed', amount: '+₹800.00', isExpense: false },
    { id: '12', merchant: 'Gas Bill', initials: 'G', category: 'Utilities', date: 'Oct 13, 2024', status: 'Completed', amount: '-₹120.00', isExpense: true },
];
const TableRows = react_1.default.memo(({ items }) => ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: items.map((transaction) => ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold", children: transaction.initials }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-800 font-medium", children: transaction.merchant })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4 text-gray-600", children: transaction.category }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4 text-gray-600", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), transaction.date] }) }), (0, jsx_runtime_1.jsx)("td", { className: "py-4 px-4 text-right font-semibold", children: (0, jsx_runtime_1.jsx)("span", { className: transaction.isExpense ? 'text-red-600' : 'text-green-600', children: transaction.amount }) })] }, transaction.id))) })));
TableRows.displayName = 'TableRows';
const Pagination = react_1.default.memo(({ totalPages, currentPage, onPageChange }) => ((0, jsx_runtime_1.jsxs)("div", { className: "mt-8 flex justify-center items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => onPageChange(currentPage - 1), disabled: currentPage === 1, className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50", children: "Previous" }), Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => onPageChange(page), className: `px-3 py-2 rounded-lg font-medium transition ${currentPage === page
                ? 'bg-blue-500 text-white'
                : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`, children: page }, page))), (0, jsx_runtime_1.jsx)("button", { onClick: () => onPageChange(currentPage + 1), disabled: currentPage === totalPages, className: "px-3 py-2 border border-gray-300 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50", children: "Next" })] })));
Pagination.displayName = 'Pagination';
function RecentTransaction() {
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const [showAll, setShowAll] = (0, react_1.useState)(false);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const itemsPerPage = 10;
    const paginatedItems = showAll
        ? SAMPLE_TRANSACTIONS.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : SAMPLE_TRANSACTIONS.slice(0, 5);
    const totalPages = Math.ceil(SAMPLE_TRANSACTIONS.length / itemsPerPage);
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
    // ✅ Updated to use onTransactionAdded instead of onSubmit
    const handleTransactionAdded = () => {
        console.log('✅ Transaction added successfully');
        // Refresh transactions list or update state here
        // You can fetch new transactions from API if needed
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-6 w-full", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-semibold text-gray-800", children: "Recent Transactions" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("button", { className: "flex items-center gap-2 text-gray-600 hover:text-gray-800", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 4a1 1 0 016 0v12a1 1 0 01-6 0V4zM15 4a1 1 0 016 0v12a1 1 0 01-6 0V4z" }) }), "Filter"] }), (0, jsx_runtime_1.jsx)("button", { onClick: showAll ? handleViewLess : handleViewAll, className: "text-blue-500 hover:text-blue-700 font-medium", children: showAll ? 'View Less' : 'View All' })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 text-gray-600 font-medium text-sm", children: "Merchant / Service" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 text-gray-600 font-medium text-sm", children: "Category" }), (0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 text-gray-600 font-medium text-sm", children: "Date" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right py-3 px-4 text-gray-600 font-medium text-sm", children: "Amount" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: (0, jsx_runtime_1.jsx)(TableRows, { items: paginatedItems }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-8 flex justify-end", children: (0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsModalOpen(true), className: "bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), "Quick Add Expense"] }) }), showAll && ((0, jsx_runtime_1.jsx)("div", { className: "mt-8", children: (0, jsx_runtime_1.jsx)(Pagination, { totalPages: totalPages, currentPage: currentPage, onPageChange: handlePageChange }) })), (0, jsx_runtime_1.jsx)(addTransaction_1.default, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), onTransactionAdded: handleTransactionAdded })] }));
}
//# sourceMappingURL=recentTransactions.js.map