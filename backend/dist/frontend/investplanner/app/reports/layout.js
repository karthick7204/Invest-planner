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
const google_1 = require("next/font/google");
const fredoka = (0, google_1.Fredoka)({
    variable: "--font-fredoka",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});
exports.metadata = {
    title: "InvestPlanner",
    description: "Manage your finances smartly",
};
function RootLayout({ children, }) {
    return ((0, jsx_runtime_1.jsxs)("body", { className: "antialiased", children: [(0, jsx_runtime_1.jsx)(sidebar_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col h-screen w-full lg:pl-64 bg-[#f6f7f6]", children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed top-0 left-0 right-0 z-50 bg-zinc-800", children: (0, jsx_runtime_1.jsx)(header_1.default, {}) }), (0, jsx_runtime_1.jsx)("main", { className: "mt-12 flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 font-poppins", children: children })] })] }));
}
//# sourceMappingURL=layout.js.map