"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCard = ExpenseCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
function ExpenseCard() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-90 h-38  bg-white rounded-lg shadow-md p-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-md font-semibold text-mauve-400", children: "Expenses" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-black", children: "\u20B92,000" }), (0, jsx_runtime_1.jsx)("div", { className: 'w-10 h-10 mt-2 rounded-full bg-red-100 flex items-center justify-center cursor-pointer hover:bg-red-200 transition', children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowDown, { size: 20, className: "text-red-600" }) })] }));
}
//# sourceMappingURL=expensecard.js.map