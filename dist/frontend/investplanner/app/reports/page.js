'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Reports;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const TimeLine_1 = require("../components/TimeLine");
const reportGraph_1 = __importDefault(require("../components/reportGraph"));
const categoryBreakdown_1 = __importDefault(require("../components/categoryBreakdown"));
const reportHeader_1 = require("./reportHeader");
function Reports() {
    const [range, setRange] = (0, react_1.useState)('monthly');
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-6xl p-4 sm:p-6 lg:p-8 transition-all duration-300", children: [(0, jsx_runtime_1.jsx)(reportHeader_1.ReportHeader, {}), (0, jsx_runtime_1.jsx)("div", { className: "w-full max-w-md mt-6 sm:mt-8", children: (0, jsx_runtime_1.jsx)(TimeLine_1.TimeLine, { range: range, setRange: setRange }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-8 mt-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-full bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden p-4 sm:p-6", children: (0, jsx_runtime_1.jsx)(reportGraph_1.default, { range: range }) }), (0, jsx_runtime_1.jsx)("div", { className: "w-full", children: (0, jsx_runtime_1.jsx)(categoryBreakdown_1.default, { range: range }) })] })] }));
}
//# sourceMappingURL=page.js.map