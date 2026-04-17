"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SignupPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const signupCard_1 = __importDefault(require("./signupCard"));
function SignupPage() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-200", children: [(0, jsx_runtime_1.jsxs)("h1", { className: "absolute left-3 top-3 text-black font-bold text-3xl", children: ["Wealth ", (0, jsx_runtime_1.jsx)("span", { className: "text-yellow-400", children: "Pilot." })] }), (0, jsx_runtime_1.jsx)(signupCard_1.default, {})] }));
}
//# sourceMappingURL=page.js.map