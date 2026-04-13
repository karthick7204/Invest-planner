'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const api_1 = require("../lib/api");
const InsightCard = () => {
    const [insight, setInsight] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchInsight = async () => {
        setLoading(true);
        setError(null);
        try {
            const userId = localStorage.getItem('userId');
            if (!userId)
                throw new Error('User not authenticated');
            const data = await (0, api_1.apiCall)(`api/ai/insights/${userId}`);
            setInsight(data.insight);
        }
        catch (err) {
            console.error('Error fetching AI insights:', err);
            setError('Could not load AI insights.');
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchInsight();
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl transition-all hover:border-zinc-700", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-violet-600 opacity-80" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-start mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-indigo-500/10 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { size: 16, className: "text-indigo-400" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-black uppercase tracking-widest text-zinc-400", children: "AI Insights" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: fetchInsight, disabled: loading, className: "text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-30", children: (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCcw, { size: 14, className: loading ? "animate-spin" : "" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "relative", children: loading ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 w-full bg-zinc-800 animate-pulse rounded" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 w-[90%] bg-zinc-800 animate-pulse rounded" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 w-[40%] bg-zinc-800 animate-pulse rounded" })] })) : error ? ((0, jsx_runtime_1.jsx)("p", { className: "text-zinc-500 text-sm italic", children: error })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-zinc-300 text-sm leading-relaxed font-medium", children: insight })) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-600/5 blur-[50px] rounded-full pointer-events-none" })] }));
};
exports.InsightCard = InsightCard;
//# sourceMappingURL=InsightCard.js.map