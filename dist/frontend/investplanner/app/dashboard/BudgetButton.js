"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetButton = BudgetButton;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const api_1 = require("../lib/api");
function BudgetButton() {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [category, setCategory] = (0, react_1.useState)("General");
    const [amount, setAmount] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [success, setSuccess] = (0, react_1.useState)(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Format current month as YYYY-MM
            const currentMonth = new Date().toISOString().substring(0, 7);
            await (0, api_1.apiCall)("/budget/set", {
                method: "POST",
                body: JSON.stringify({
                    category,
                    limit: Number(amount),
                    month: currentMonth
                }),
            });
            setSuccess(true);
            setTimeout(() => {
                setIsOpen(false);
                setSuccess(false);
                setAmount("");
                // Notify other components to refresh if needed
                window.dispatchEvent(new Event('budgetUpdated'));
            }, 1500);
        }
        catch (error) {
            console.error("Failed to set budget:", error);
            alert("Error saving budget. Please check your connection.");
        }
        finally {
            setLoading(false);
        }
    };
    const categories = ["General", "Food", "Transport", "Rent", "Groceries", "Entertainment", "Shopping", "Utilities", "Healthcare"];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsOpen(!isOpen), className: "flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-slate-800 active:scale-95 transition-all font-medium text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { size: 18 }), "Set Budget"] }), isOpen && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute right-0 top-14 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-50 animate-in fade-in zoom-in duration-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-slate-800 text-lg", children: "Define Budget" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsOpen(false), className: "text-slate-400 hover:text-slate-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "flex flex-col gap-5", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1", children: "Category" }), (0, jsx_runtime_1.jsx)("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "w-full text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all appearance-none", children: categories.map(cat => ((0, jsx_runtime_1.jsx)("option", { value: cat, children: cat }, cat))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1", children: "Monthly Limit" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold", children: "\u20B9" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0.00", className: "w-full text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 pl-8 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all", required: true })] })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading || success, className: `mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm shadow-md ${success
                                    ? "bg-green-500 text-white"
                                    : "bg-amber-500 text-white hover:bg-amber-600 active:scale-95 disabled:opacity-70"}`, children: loading ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "animate-spin", size: 18 }) : success ? (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { size: 18 }) : "Save Budget Goal" })] }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-4 text-[10px] text-center text-slate-400 font-medium", children: ["This budget will apply to ", new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })] })] }))] }));
}
//# sourceMappingURL=BudgetButton.js.map