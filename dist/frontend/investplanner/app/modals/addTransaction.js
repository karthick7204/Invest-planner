'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AddTransactionModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const api_1 = require("@/app/lib/api");
const EXPENSE_CATEGORIES = ['Dining', 'Transport', 'Shopping', 'Utilities', 'Work', 'Health', 'Entertainment'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other'];
function AddTransactionModal({ isOpen, onClose, onTransactionAdded }) {
    const [transactionType, setTransactionType] = (0, react_1.useState)('expense');
    const [formData, setFormData] = (0, react_1.useState)({
        purpose: '',
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
    });
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const categories = transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    const handleTypeChange = (type) => {
        setTransactionType(type);
        setFormData({
            ...formData,
            type,
            category: '', // Reset category when switching tabs
        });
    };
    const handleAmountChange = (e) => {
        const value = e.target.value;
        setFormData({
            ...formData,
            amount: value === '' ? 0 : parseFloat(value)
        });
    };
    const handleCategoryClick = (category) => {
        setFormData({ ...formData, category });
    };
    const handleDateChange = (e) => {
        setFormData({ ...formData, date: e.target.value });
    };
    const handlePurposeChange = (e) => {
        setFormData({ ...formData, purpose: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        // Validate form
        if (!formData.purpose) {
            setError('Please enter a purpose');
            setLoading(false);
            return;
        }
        if (formData.amount <= 0) {
            setError('Please enter a valid amount');
            setLoading(false);
            return;
        }
        if (!formData.category) {
            setError('Please select a category');
            setLoading(false);
            return;
        }
        try {
            // ✅ Different API endpoints for expense and income
            const endpoint = transactionType === 'expense' ? '/expense/create' : '/expense/income';
            const response = await (0, api_1.apiCall)(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    purpose: formData.purpose,
                    amount: formData.amount,
                    category: formData.category,
                    date: formData.date,
                }),
            });
            console.log(`✅ ${transactionType === 'expense' ? 'Expense' : 'Income'} created:`, response);
            // Reset form
            setFormData({
                purpose: '',
                amount: 0,
                category: '',
                date: new Date().toISOString().split('T')[0],
                type: transactionType,
            });
            // Callback to parent component
            if (onTransactionAdded) {
                onTransactionAdded();
            }
            onClose();
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to create transaction');
            console.error('Error:', error);
        }
        finally {
            setLoading(false);
        }
    };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-6 w-96 max-h-screen overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-800", children: "Add Transaction" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700 text-2xl cursor-pointer", children: "\u2715" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mb-6", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleTypeChange('expense'), className: `flex-1 py-2 px-4 rounded-lg font-semibold transition ${transactionType === 'expense'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'}`, children: "- Expense" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleTypeChange('income'), className: `flex-1 py-2 px-4 rounded-lg font-semibold transition ${transactionType === 'income'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'}`, children: "+ Income" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 text-sm mb-6", children: transactionType === 'expense' ? 'Record your daily expenses' : 'Record your income' }), error && ((0, jsx_runtime_1.jsx)("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg", children: error })), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "PURPOSE" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.purpose, onChange: handlePurposeChange, placeholder: transactionType === 'expense' ? 'What did you spend on?' : 'What was the income from?', className: "w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "AMOUNT" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("span", { className: "absolute left-3 top-2 text-black", children: "\u20B9" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: formData.amount || '', onChange: handleAmountChange, placeholder: "0.00", className: "w-full pl-8 pr-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-3", children: "CATEGORY" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-3 gap-2", children: categories.map((cat) => ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleCategoryClick(cat), className: `py-2 px-3 rounded-lg text-sm font-medium transition ${formData.category === cat
                                            ? transactionType === 'expense'
                                                ? 'bg-red-500 text-white'
                                                : 'bg-green-500 text-white'
                                            : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'}`, children: cat }, cat))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "DATE" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: formData.date, onChange: handleDateChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 pt-4", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onClose, className: "flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading, className: `flex-1 py-2 px-4 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${transactionType === 'expense'
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-green-500 hover:bg-green-600'}`, children: loading ? 'Saving...' : `Add ${transactionType === 'expense' ? 'Expense' : 'Income'}` })] })] })] }) }));
}
//# sourceMappingURL=addTransaction.js.map