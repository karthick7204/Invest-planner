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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full h-full min-h-[9.5rem] bg-yellow-300 rounded-xl shadow-sm p-5 flex flex-col justify-between border border-yellow-400/50", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-semibold text-yellow-900 uppercase tracking-wide", children: "Surplus" }), (0, jsx_runtime_1.jsx)("p", { className: "text-3xl font-bold text-black mt-1", children: loading ? "..." : `₹${surplus.toLocaleString()}` })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 mt-4 rounded-full bg-yellow-400 flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition shadow-inner", title: "Surplus", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Wallet, { size: 20, className: "text-yellow-900" }) })] }));
}
//# sourceMappingURL=surplusCard.js.map