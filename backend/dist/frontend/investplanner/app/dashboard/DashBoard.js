"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const cashFlowGraph_1 = require("./cashFlowGraph");
const expensecard_1 = require("./expensecard");
const incomecard_1 = __importDefault(require("./incomecard"));
const recentTransactions_1 = __importDefault(require("./recentTransactions"));
const surplusCard_1 = require("./surplusCard");
const BudgetButton_1 = require("./BudgetButton");
const BudgetStatus_1 = require("./BudgetStatus");
function DashboardPage() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full flex flex-col items-start justify-start gap-6 pb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "font-bold text-black text-2xl md:text-3xl tracking-tight", children: "Financial Overview" }), (0, jsx_runtime_1.jsx)("p", { className: "font-light text-mauve-500 text-sm md:text-base mt-1", children: "Welcome back, Here's what's new happening with your money" })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full sm:w-auto self-start sm:self-auto flex sm:justify-end shrink-0", children: (0, jsx_runtime_1.jsx)(BudgetButton_1.BudgetButton, {}) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full", children: [(0, jsx_runtime_1.jsx)(incomecard_1.default, {}), (0, jsx_runtime_1.jsx)(expensecard_1.ExpenseCard, {}), (0, jsx_runtime_1.jsx)(surplusCard_1.SurplusCard, {})] }), (0, jsx_runtime_1.jsx)(BudgetStatus_1.BudgetStatus, {}), (0, jsx_runtime_1.jsx)("div", { className: "w-full", children: (0, jsx_runtime_1.jsx)(cashFlowGraph_1.CashFlowGraph, {}) }), (0, jsx_runtime_1.jsx)("div", { className: "w-full", children: (0, jsx_runtime_1.jsx)(recentTransactions_1.default, {}) })] }));
}
//# sourceMappingURL=DashBoard.js.map