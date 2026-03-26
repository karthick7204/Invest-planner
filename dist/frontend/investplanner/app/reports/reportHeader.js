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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex w-full justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-black", children: "Financial Reports" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mt-2", children: "Deep-dive analysis of your spending habits and capital growth recommendations." })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleDownload, className: "flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-gray-800 transition text-sm font-medium shrink-0", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { size: 18 }), "Download"] })] }));
}
//# sourceMappingURL=reportHeader.js.map