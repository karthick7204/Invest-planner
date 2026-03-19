"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const loginCard_1 = __importDefault(require("./loginCard"));
function LoginPage() {
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.22) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
        }, className: "bg-gray-100 h-lvh w-full flex flex-col items-center justify-center p-6 rounded-lg shadow-md", children: [(0, jsx_runtime_1.jsxs)("h1", { className: "absolute left-3 top-3 text-black font-bold text-3xl", children: ["Wealth ", (0, jsx_runtime_1.jsx)("span", { className: "text-yellow-400", children: "Pilot." })] }), (0, jsx_runtime_1.jsx)(loginCard_1.default, {})] }));
}
//# sourceMappingURL=page.js.map