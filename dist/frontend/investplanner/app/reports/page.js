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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "ml-64 p-8 w-4xl", children: [(0, jsx_runtime_1.jsx)(reportHeader_1.ReportHeader, {}), (0, jsx_runtime_1.jsx)("div", { className: "w-100 mt-6", children: (0, jsx_runtime_1.jsx)(TimeLine_1.TimeLine, { range: range, setRange: setRange }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-8 w-full", children: (0, jsx_runtime_1.jsx)(reportGraph_1.default, { range: range }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-8 w-full", children: (0, jsx_runtime_1.jsx)(categoryBreakdown_1.default, { range: range }) })] }));
}
//# sourceMappingURL=page.js.map