'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AIInsightsPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const api_1 = require("../lib/api");
const InsightCard_1 = require("./InsightCard");
// --- Card Components ---
const Card = ({ children, className = "" }) => ((0, jsx_runtime_1.jsx)("div", { className: `bg-white rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-200 ${className}`, children: children }));
const CardHeader = ({ title, icon: Icon, accentColor }) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mb-8", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center ${accentColor}`, children: (0, jsx_runtime_1.jsx)(Icon, { size: 22 }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold tracking-tight text-gray-900", children: title })] }));
// --- ProgressBar Component ---
const ProgressBar = ({ label, value, max, colorClass }) => {
    const percentage = Math.min((value / max) * 100, 100);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-400", children: [(0, jsx_runtime_1.jsx)("span", { children: label }), (0, jsx_runtime_1.jsxs)("span", { children: ["\u20B9", value.toLocaleString('en-IN'), " / \u20B9", max.toLocaleString('en-IN')] })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-2 w-full bg-gray-100 rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: `h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`, style: { width: `${percentage}%` } }) })] }));
};
// --- Main Component ---
function AIInsightsPage() {
    const [useOverspending, setUseOverspending] = (0, react_1.useState)(true);
    const [analysis, setAnalysis] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const isProduction = process.env.NODE_ENV === 'production';
    const fetchInsights = async () => {
        if (isProduction)
            return; // Skip logic in production
        setLoading(true);
        setError(null);
        try {
            const userId = localStorage.getItem("userId");
            console.log("🔍 Wealth AI Requesting Insights for UserID:", userId);
            if (!userId) {
                throw new Error("User ID not found. Please log in again.");
            }
            // We call the real backend AI Insights API
            const result = await (0, api_1.apiCall)(`ai/insights/${userId}`, {
                method: "POST"
            });
            console.log("💎 Wealth AI Response Data:", result);
            setAnalysis(result);
        }
        catch (err) {
            console.error("Fetch AI Insights error:", err);
            setError(err.message || "Failed to connect with Wealth AI.");
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        if (!isProduction) {
            fetchInsights();
        }
        else {
            setLoading(false);
        }
    }, []);
    if (isProduction) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-[80vh] flex flex-col items-center justify-center p-20 text-center space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-24 h-24 bg-zinc-900 rounded-3xl flex items-center justify-center shadow-xl border border-white/10 animate-in zoom-in duration-500", children: (0, jsx_runtime_1.jsx)(SparkleIcon, { className: "text-amber-500", size: 48 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-black tracking-tight text-zinc-900 italic", children: "AI INSIGHTS" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-zinc-500 font-medium text-lg max-w-sm mx-auto", children: ["Our artificial intelligence engine is currently ", (0, jsx_runtime_1.jsx)("span", { className: "text-zinc-900 font-bold underline decoration-amber-500 decoration-2 underline-offset-4", children: "under construction" }), " for live accounts."] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "pt-10 flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-px w-12 bg-zinc-200" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400", children: "Coming Soon" }), (0, jsx_runtime_1.jsx)("div", { className: "h-px w-12 bg-zinc-200" })] })] }));
    }
    const healthScore = (0, react_1.useMemo)(() => {
        if (!analysis)
            return 0;
        const { metrics } = analysis;
        if (metrics.total_expenses > metrics.salary)
            return 42;
        if (metrics.surplus < (metrics.salary * 0.1))
            return 68;
        return 85;
    }, [analysis]);
    const surplusRatio = (0, react_1.useMemo)(() => {
        if (!analysis)
            return 0;
        const { metrics } = analysis;
        return ((metrics.surplus / metrics.salary) * 100).toFixed(1);
    }, [analysis]);
    if (loading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-full flex flex-col items-center justify-center p-20 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" }), (0, jsx_runtime_1.jsx)(SparkleIcon, { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse", size: 24 })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-gray-900", children: "Consulting Wealth AI..." }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 text-sm italic", children: "Analyzing your spending trajectory and market cycles." })] })] }));
    }
    if (error || !analysis) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-full flex flex-col items-center justify-center p-20 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 p-6 rounded-full text-red-500 mb-6", children: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { size: 48 }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Connection Issues" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 mb-8 max-w-md", children: error || "AI Insights are currently unavailable for your current account data state." }), (0, jsx_runtime_1.jsxs)("button", { onClick: fetchInsights, className: "px-6 py-3 bg-zinc-800 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-700 transition-all active:scale-95", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCcw, { size: 18 }), " Retry Connection"] })] }));
    }
    const { metrics, insights, suggestions, investmentAdvice, title } = analysis;
    const isOverspending = metrics.total_expenses > metrics.salary;
    const isLowSurplus = !isOverspending && (metrics.surplus < metrics.salary * 0.1);
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-full", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-5xl mx-auto px-6 py-12 space-y-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-100 pb-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "px-2.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-md", children: "Live Platform Analysis" }), isProduction && ((0, jsx_runtime_1.jsx)("span", { className: "px-2.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-amber-100", children: "Development Preview" }))] }), (0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold tracking-tight text-gray-900", children: title || "AI Deep Insights" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 font-medium", children: "Smart financial auditing with real-time feedback loops. Data sourced from your recent transactions." })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-3", children: (0, jsx_runtime_1.jsx)("button", { onClick: fetchInsights, className: "w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-zinc-800 hover:text-white transition-all shadow-sm border border-gray-100", title: "Refresh analysis", children: (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCcw, { size: 18 }) }) })] }), (0, jsx_runtime_1.jsx)(InsightCard_1.InsightCard, {}), (isOverspending || isLowSurplus) && ((0, jsx_runtime_1.jsxs)("div", { className: `group rounded-[2rem] p-8 border flex items-start gap-6 transition-all duration-500 animate-in slide-in-from-top-4 ${isOverspending
                        ? 'bg-red-50/50 border-red-100/50'
                        : 'bg-amber-50/50 border-amber-100/50'}`, children: [(0, jsx_runtime_1.jsx)("div", { className: `p-4 rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-inner ${isOverspending ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`, children: isOverspending ? (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { size: 28 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Info, { size: 28 }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: `text-xl font-bold tracking-tight ${isOverspending ? 'text-red-900' : 'text-amber-900'}`, children: isOverspending ? 'Critical Overspending Alert' : 'Low Component Surplus' }), (0, jsx_runtime_1.jsx)("p", { className: `text-[15px] mt-2 leading-relaxed font-medium ${isOverspending ? 'text-red-800/70' : 'text-amber-800/70'}`, children: isOverspending
                                        ? `System analysis indicates your current monthly burn of ₹${metrics.total_expenses.toLocaleString('en-IN')} is exceeding your income. This trajectory will deplete cash reserves by ₹${Math.abs(metrics.surplus).toLocaleString('en-IN')} each month.`
                                        : `Your current surplus (₹${metrics.surplus.toLocaleString('en-IN')}) is below the recommended 10% safety threshold. Maintaining this at ${surplusRatio}% slows down long-term wealth compounding.` }), (0, jsx_runtime_1.jsxs)("button", { className: `mt-5 text-sm font-bold flex items-center gap-1.5 transition-opacity hover:opacity-80 ${isOverspending ? 'text-red-600' : 'text-amber-600'}`, children: ["Audit Transaction Flow ", (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { size: 16 })] })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [(0, jsx_runtime_1.jsxs)(Card, { className: "p-10", children: [(0, jsx_runtime_1.jsx)(CardHeader, { title: "Strategic Insights", icon: lucide_react_1.PieChart, accentColor: "bg-gray-100 text-gray-700 border border-gray-200" }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-6", children: insights.map((insight, idx) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex gap-4 text-gray-600 leading-relaxed font-medium", children: [(0, jsx_runtime_1.jsx)("div", { className: "mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[16px]", children: insight })] }, idx))) })] }), (0, jsx_runtime_1.jsxs)(Card, { className: "p-10", children: [(0, jsx_runtime_1.jsx)(CardHeader, { title: "Optimizations", icon: lucide_react_1.Lightbulb, accentColor: "bg-blue-50 text-blue-600 border border-blue-100" }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-6", children: suggestions.map((suggestion, idx) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex gap-4 text-gray-600 leading-relaxed font-medium group cursor-default", children: [(0, jsx_runtime_1.jsx)("div", { className: "mt-1 flex items-center justify-center shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { size: 12 }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-[16px]", children: suggestion })] }, idx))) })] }), (0, jsx_runtime_1.jsxs)(Card, { className: "p-10 md:col-span-2", children: [(0, jsx_runtime_1.jsx)(CardHeader, { title: "Investment & Capital Strategy", icon: lucide_react_1.Target, accentColor: "bg-emerald-50 text-emerald-600 border border-emerald-100" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-3", children: (0, jsx_runtime_1.jsx)("ul", { className: "space-y-8", children: investmentAdvice.map((item, idx) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex gap-4 items-start group", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-lg bg-emerald-50 text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity", children: (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { size: 18 }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[16px] font-semibold text-gray-800 leading-relaxed", children: item }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 font-medium", children: "Automatic advisory based on current liquidity." })] })] }, idx))) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-2 flex flex-col justify-between space-y-8 bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-end justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-black uppercase tracking-widest text-gray-400", children: "Health Index" }), (0, jsx_runtime_1.jsxs)("h4", { className: "text-3xl font-black text-gray-900", children: [healthScore, "%"] })] }), (0, jsx_runtime_1.jsx)("span", { className: `text-xs font-bold px-2 py-1 rounded-md ${healthScore < 50 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`, children: healthScore < 50 ? 'Critical' : healthScore < 80 ? 'Stable' : 'Excellent' })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 w-full bg-gray-200 rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: `h-full transition-all duration-[1.5s] ease-out shadow-[0_0_12px_rgba(16,185,129,0.3)] ${healthScore < 50 ? 'bg-red-500' : 'bg-emerald-500'}`, style: { width: `${healthScore}%` } }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6 pt-4 border-t border-gray-200", children: [(0, jsx_runtime_1.jsx)(ProgressBar, { label: "Top Category Burn", value: metrics.category_expenses[0]?.amount || 0, max: metrics.total_expenses || 1, colorClass: "bg-blue-500" }), (0, jsx_runtime_1.jsx)(ProgressBar, { label: "Investment Ratio", value: metrics.investments || 0, max: metrics.salary || 1, colorClass: "bg-emerald-400" })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-[11px] text-gray-400 font-medium flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Info, { size: 12, className: "shrink-0" }), "Confidence: 94%. Insights refreshed recently."] })] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
                        { label: 'Surplus', value: `₹${metrics.surplus.toLocaleString('en-IN')}`, icon: lucide_react_1.IndianRupee, color: metrics.surplus < 0 ? 'text-red-500' : 'text-emerald-500' },
                        { label: 'Ratio', value: `${surplusRatio}%`, icon: lucide_react_1.Wallet, color: 'text-gray-900' },
                        { label: 'Invested', value: `₹${metrics.investments.toLocaleString('en-IN')}`, icon: lucide_react_1.Target, color: 'text-gray-900' },
                        { label: 'Growth', value: '+12.4%', icon: lucide_react_1.TrendingUp, color: 'text-emerald-500' },
                    ].map((metric, i) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-5 rounded-2xl border border-gray-100 flex flex-col gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-start", children: [(0, jsx_runtime_1.jsx)(metric.icon, { size: 16, className: "text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-black uppercase tracking-widest text-gray-400", children: metric.label })] }), (0, jsx_runtime_1.jsx)("p", { className: `text-xl font-bold tracking-tight ${metric.color}`, children: metric.value })] }, metric.label))) }), (0, jsx_runtime_1.jsxs)("div", { className: "relative overflow-hidden bg-zinc-800 rounded-[2.5rem] p-10 text-white border border-white/5 shadow-xl", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10 flex flex-col md:flex-row items-center justify-between gap-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center md:text-left space-y-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-2xl font-bold italic tracking-tight", children: "Wealth AI Orchestrator" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm font-medium", children: "Continuously learning from your spending patterns to optimize your net worth velocity." })] }), (0, jsx_runtime_1.jsx)("button", { onClick: fetchInsights, className: "px-8 py-4 bg-white text-black font-black text-sm uppercase tracking-widest rounded-full hover:bg-gray-100 transition-all active:scale-95 shadow-xl", children: "Apply All Strategies" })] })] })] }) }));
}
const SparkleIcon = (props) => ((0, jsx_runtime_1.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [(0, jsx_runtime_1.jsx)("path", { d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" }), (0, jsx_runtime_1.jsx)("path", { d: "M5 3v4" }), (0, jsx_runtime_1.jsx)("path", { d: "M19 17v4" }), (0, jsx_runtime_1.jsx)("path", { d: "M3 5h4" }), (0, jsx_runtime_1.jsx)("path", { d: "M17 19h4" })] }));
//# sourceMappingURL=page.js.map