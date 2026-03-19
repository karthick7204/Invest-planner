"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashFlowGraph = CashFlowGraph;
const jsx_runtime_1 = require("react/jsx-runtime");
const graphChart_1 = __importDefault(require("../components/graphChart"));
function CashFlowGraph() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full h-lvh bg-white rounded-lg shadow-md p-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-bold mb-4 text-black", children: "Cash Flow Analysis" }), (0, jsx_runtime_1.jsx)("p", { className: "text-md text-mauve-500", children: "visualizing your financial health over time" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top- w-full  rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(graphChart_1.default, {}) })] }));
}
//# sourceMappingURL=cashFlowGraph.js.map