"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IncomeCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const api_1 = require("../lib/api");
function IncomeCard() {
    const [totalIncome, setTotalIncome] = (0, react_1.useState)(0);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const fetchIncome = async () => {
            setLoading(true);
            try {
                const data = await (0, api_1.apiCall)("/expense/income");
                if (data && data.income) {
                    const total = data.income.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
                    setTotalIncome(total);
                }
            }
            catch (error) {
                console.error("Failed to fetch income:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchIncome();
        // Re-fetch when a new transaction is added
        if (typeof window !== 'undefined') {
            window.addEventListener('transactionAdded', fetchIncome);
            return () => window.removeEventListener('transactionAdded', fetchIncome);
        }
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-90 h-38 bg-white rounded-lg shadow-md p-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-md font-semibold text-mauve-400", children: "Income" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-black", children: loading ? "..." : `₹${totalIncome.toLocaleString()}` }), (0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 mt-2 rounded-full bg-green-100 flex items-center justify-center cursor-pointer hover:bg-green-200 transition", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUp, { size: 20, className: "text-green-600" }) })] }));
}
//# sourceMappingURL=incomecard.js.map