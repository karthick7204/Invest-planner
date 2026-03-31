"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const header_1 = __importDefault(require("@/app/header/header"));
const sidebar_1 = __importDefault(require("../sidebar/sidebar"));
exports.metadata = {
    title: "AI Insights | InvestPlanner",
    description: "Advanced AI financial insights for your wealth growth",
};
function RootLayout({ children, }) {
    return ((0, jsx_runtime_1.jsxs)("body", { className: "antialiased", children: [(0, jsx_runtime_1.jsx)(sidebar_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col h-screen w-full lg:pl-64 bg-[#fbfbfb]", children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100", children: (0, jsx_runtime_1.jsx)(header_1.default, {}) }), (0, jsx_runtime_1.jsx)("main", { className: "mt-16 flex-1 overflow-x-hidden overflow-y-auto font-poppins", children: children })] })] }));
}
//# sourceMappingURL=layout.js.map