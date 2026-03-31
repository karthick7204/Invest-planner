"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetStatus = BudgetStatus;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const api_1 = require("../lib/api");
const lucide_react_1 = require("lucide-react");
function BudgetStatus() {
    const [budgets, setBudgets] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [deletingId, setDeletingId] = (0, react_1.useState)(null);
    const [confirmDeleteId, setConfirmDeleteId] = (0, react_1.useState)(null);
    const fetchBudgets = async () => {
        try {
            const month = new Date().toISOString().substring(0, 7);
            const data = await (0, api_1.apiCall)(`/budget?month=${month}`);
            if (data && data.budgets) {
                setBudgets(data.budgets);
            }
        }
        catch (error) {
            console.error("Error fetching budgets:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async (budgetId) => {
        if (confirmDeleteId !== budgetId) {
            setConfirmDeleteId(budgetId);
            // Auto-reset after 3 seconds if not confirmed
            setTimeout(() => setConfirmDeleteId(null), 3000);
            return;
        }
        setConfirmDeleteId(null);
        setDeletingId(budgetId);
        try {
            await (0, api_1.apiCall)(`/budget/${budgetId}`, {
                method: 'DELETE'
            });
            // Update local state
            setBudgets(budgets.filter(b => b._id !== budgetId));
            // Notify other components (like the graph)
            window.dispatchEvent(new Event('budgetUpdated'));
        }
        catch (error) {
            console.error("Error deleting budget:", error);
            alert("Failed to delete budget");
        }
        finally {
            setDeletingId(null);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchBudgets();
        // Listen for budget updates
        const handleUpdate = () => fetchBudgets();
        window.addEventListener('budgetUpdated', handleUpdate);
        window.addEventListener('transactionAdded', handleUpdate); // Also refresh when spending changes
        return () => {
            window.removeEventListener('budgetUpdated', handleUpdate);
            window.removeEventListener('transactionAdded', handleUpdate);
        };
    }, []);
    if (loading)
        return null;
    if (budgets.length === 0)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-amber-50 p-2.5 rounded-2xl text-amber-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Target, { size: 20 }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-slate-800", children: "Budget Progress" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-400 font-medium", children: "Monthly spending limits" })] })] }), (0, jsx_runtime_1.jsx)("button", { className: "text-slate-400 hover:text-slate-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreHorizontal, { size: 20 }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: budgets.map((budget) => {
                    const percent = Math.min(100, (budget.spent / budget.limit) * 100);
                    const isWarning = percent > 80 && percent <= 100;
                    const isDanger = budget.isExceeded;
                    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative flex flex-col gap-3 group p-2 rounded-2xl hover:bg-slate-50/50 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "font-bold text-slate-700 text-sm flex items-center gap-2", children: [budget.category, isDanger && (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { size: 14, className: "text-rose-500 animate-pulse" }), !isDanger && percent > 90 && (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { size: 14, className: "text-amber-500" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                                            e.stopPropagation();
                                            handleDelete(budget._id);
                                        }, disabled: deletingId === budget._id, className: `transition-all duration-300 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold 
                    ${confirmDeleteId === budget._id
                                            ? "bg-rose-500 text-white shadow-sm ring-2 ring-rose-200"
                                            : "opacity-0 group-hover:opacity-100 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50"} ${deletingId === budget._id ? "opacity-100 bg-slate-100 cursor-not-allowed" : ""}`, title: confirmDeleteId === budget._id ? "Confirm Deletion" : "Delete Budget", children: confirmDeleteId === budget._id ? ((0, jsx_runtime_1.jsx)("span", { className: "text-[11px] uppercase tracking-tighter", children: "Confirm?" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { size: 16, className: deletingId === budget._id ? "animate-spin" : "" })) }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-bold text-slate-400", children: [(0, jsx_runtime_1.jsxs)("span", { className: isDanger ? "text-rose-600" : "text-slate-700", children: ["\u20B9", budget.spent.toLocaleString()] }), " / ", "\u20B9", budget.limit.toLocaleString()] })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50", children: (0, jsx_runtime_1.jsx)("div", { className: `h-full transition-all duration-700 ease-out rounded-full ${isDanger ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-emerald-500"}`, style: { width: `${percent}%` } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("p", { className: `text-[10px] font-bold uppercase tracking-wider ${isDanger ? "text-rose-500" : "text-slate-400"}`, children: isDanger ? "Limit Exceeded" : `${Math.round(percent)}% Used` }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: budget.remaining > 0 ? `₹${budget.remaining.toLocaleString()} Left` : "No limit left" })] })] }, budget._id));
                }) })] }));
}
//# sourceMappingURL=BudgetStatus.js.map