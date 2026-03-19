"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurplusCard = SurplusCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
function SurplusCard() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-90 h-38 bg-yellow-300 rounded-lg shadow-md p-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-black", children: "Surplus" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-black", children: "\u20B93,000" }), (0, jsx_runtime_1.jsx)("div", { className: 'w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer hover:bg-blue-200 transition', title: "Surplus", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Wallet, { size: 20, className: "text-blue-600" }) })] }));
}
//# sourceMappingURL=surplusCard.js.map