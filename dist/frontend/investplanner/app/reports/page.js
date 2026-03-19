"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Reports;
const jsx_runtime_1 = require("react/jsx-runtime");
const TimeLine_1 = require("../components/TimeLine");
const reportGraph_1 = __importDefault(require("../components/reportGraph"));
const categoryBreakdown_1 = __importDefault(require("../components/categoryBreakdown"));
const reportHeader_1 = require("./reportHeader");
function Reports() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "ml-64 p-8 w-4xl", children: [(0, jsx_runtime_1.jsx)(reportHeader_1.ReportHeader, {}), (0, jsx_runtime_1.jsx)("div", { className: "w-100 mt-6", children: (0, jsx_runtime_1.jsx)(TimeLine_1.TimeLine, {}) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-8 w-full", children: (0, jsx_runtime_1.jsx)(reportGraph_1.default, {}) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-8 w-full", children: (0, jsx_runtime_1.jsx)(categoryBreakdown_1.default, {}) })] }));
}
//# sourceMappingURL=page.js.map