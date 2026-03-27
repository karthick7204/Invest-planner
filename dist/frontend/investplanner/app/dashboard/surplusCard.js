"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurplusCard = SurplusCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const api_1 = require("../lib/api");
function SurplusCard() {
    const [surplus, setSurplus] = (0, react_1.useState)(0);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const fetchSurplus = async () => {
            setLoading(true);
            try {
                const data = await (0, api_1.apiCall)("/expense/surplusincome");
                if (data && data.surplus !== undefined) {
                    setSurplus(data.surplus);
                }
            }
            catch (error) {
                console.error("Failed to fetch surplus:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchSurplus();
        // Re-fetch when a new transaction is added
        if (typeof window !== 'undefined') {
            window.addEventListener('transactionAdded', fetchSurplus);
            return () => window.removeEventListener('transactionAdded', fetchSurplus);
        }
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-90 h-38 bg-yellow-300 rounded-lg shadow-md p-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-black", children: "Surplus" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-black", children: loading ? "..." : `₹${surplus.toLocaleString()}` }), (0, jsx_runtime_1.jsx)("div", { className: 'w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer hover:bg-blue-200 transition', title: "Surplus", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Wallet, { size: 20, className: "text-blue-600" }) })] }));
}
//# sourceMappingURL=surplusCard.js.map