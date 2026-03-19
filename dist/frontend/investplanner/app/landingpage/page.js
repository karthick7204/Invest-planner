"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LandingPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const hero_1 = __importDefault(require("./hero"));
const image_1 = __importDefault(require("./image"));
function LandingPage() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-200 h-screen flex items-center justify-center overflow-hidden", style: {
            backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.22) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
        }, children: [(0, jsx_runtime_1.jsx)(hero_1.default, {}), (0, jsx_runtime_1.jsx)("div", { className: "mt-145", children: (0, jsx_runtime_1.jsx)(image_1.default, {}) })] }));
}
//# sourceMappingURL=page.js.map