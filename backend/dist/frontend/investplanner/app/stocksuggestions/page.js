"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StockSuggestionsPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const suggestedstocks_1 = __importDefault(require("./suggestedstocks"));
function StockSuggestionsPage() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "ml-64 p-8 w-4xl", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold mb-8 text-black", children: "Stock Suggestions" }), (0, jsx_runtime_1.jsx)(suggestedstocks_1.default, {})] }));
}
//# sourceMappingURL=page.js.map