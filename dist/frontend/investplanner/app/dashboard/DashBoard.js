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
function DashboardPage() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "absolute bg-[#f6f7f6]  top-12 left-52 flex flex-col items-start justify-start gap-4 p-4", children: [(0, jsx_runtime_1.jsx)("h1", { className: "font-bold text-black text-3xl", children: "Financial Overview" }), (0, jsx_runtime_1.jsx)("p", { className: "font-light text-mauve-500", children: "Welcome back name,Here's what's new happening with you money" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-row gap-16", children: [(0, jsx_runtime_1.jsx)(incomecard_1.default, {}), (0, jsx_runtime_1.jsx)(expensecard_1.ExpenseCard, {}), (0, jsx_runtime_1.jsx)(surplusCard_1.SurplusCard, {})] }), (0, jsx_runtime_1.jsx)(cashFlowGraph_1.CashFlowGraph, {}), (0, jsx_runtime_1.jsx)(recentTransactions_1.default, {})] }));
}
//# sourceMappingURL=DashBoard.js.map