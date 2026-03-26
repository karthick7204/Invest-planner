"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetButton = BudgetButton;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
function BudgetButton() {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [budgetType, setBudgetType] = (0, react_1.useState)("monthly");
    const [amount, setAmount] = (0, react_1.useState)("");
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Budget set:", { type: budgetType, amount });
        setIsOpen(false);
        // You can integrate API call here in the future
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsOpen(!isOpen), className: "flex items-center gap-2 bg-gray-700 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-gray-800 transition", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { size: 18 }), "Set Budget"] }), isOpen && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute right-0 top-14 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-50", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-gray-800 mb-4 text-lg", children: "Set New Budget" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700 block mb-1.5", children: "Duration" }), (0, jsx_runtime_1.jsxs)("select", { value: budgetType, onChange: (e) => setBudgetType(e.target.value), className: "w-full text-black bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black", children: [(0, jsx_runtime_1.jsx)("option", { value: "monthly", className: "text-black", children: "Monthly" }), (0, jsx_runtime_1.jsx)("option", { value: "yearly", className: "text-black", children: "Yearly" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-700 block mb-1.5", children: "Amount" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("span", { className: "absolute left-3.5 top-2.5 text-black font-medium", children: "\u20B9" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0.00", className: "w-full text-black bg-gray-50 border border-gray-200 rounded-lg p-2.5 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-black", required: true })] })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "mt-3 w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition text-sm font-medium shadow-md", children: "Save Budget" })] })] }))] }));
}
//# sourceMappingURL=BudgetButton.js.map