"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCard = ExpenseCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const api_1 = require("../lib/api");
function ExpenseCard() {
    const [totalExpense, setTotalExpense] = (0, react_1.useState)(0);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const fetchExpenses = async () => {
            setLoading(true);
            try {
                const data = await (0, api_1.apiCall)("/expense/expenses");
                if (data && data.expenses) {
                    const total = data.expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
                    setTotalExpense(total);
                }
            }
            catch (error) {
                console.error("Failed to fetch expenses:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchExpenses();
        // Re-fetch when a new transaction is added
        if (typeof window !== 'undefined') {
            window.addEventListener('transactionAdded', fetchExpenses);
            return () => window.removeEventListener('transactionAdded', fetchExpenses);
        }
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full h-full min-h-[9.5rem] bg-white rounded-xl shadow-sm p-5 flex flex-col justify-between border border-gray-100", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-semibold text-gray-500 uppercase tracking-wide", children: "Expenses" }), (0, jsx_runtime_1.jsx)("p", { className: "text-3xl font-bold text-black mt-1", children: loading ? "..." : `₹${totalExpense.toLocaleString()}` })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 mt-4 rounded-full bg-red-50 flex items-center justify-center cursor-pointer hover:bg-red-100 transition border border-red-100", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowDown, { size: 20, className: "text-red-500" }) })] }));
}
//# sourceMappingURL=expensecard.js.map