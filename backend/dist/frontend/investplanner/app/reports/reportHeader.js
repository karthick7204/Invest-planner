"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportHeader = ReportHeader;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
function ReportHeader() {
    const handleDownload = () => {
        // Logic to export the report to PDF or CSV goes here
        console.log("Triggering report download...");
        alert("Downloading report...");
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-1", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl sm:text-3xl font-black text-gray-900 tracking-tight", children: "Financial Report" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 text-sm font-medium", children: "Detailed analysis of your spending habits and capital growth recommendations." })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleDownload, className: "w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-2xl shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95 text-sm font-black shrink-0", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { size: 18, strokeWidth: 2.5 }), "Export Data"] })] }));
}
//# sourceMappingURL=reportHeader.js.map