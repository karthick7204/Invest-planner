'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Header;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const addTransaction_1 = __importDefault(require("../modals/addTransaction"));
const lucide_react_1 = require("lucide-react");
function Header() {
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const handleTransactionAdded = () => {
        console.log('✅ Transaction added successfully');
        // Refresh transactions list or update state here
        // You can fetch new transactions from API if needed
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex p-4 h-15 justify-between border-b-2 bg-[#ffffff] border-gray-200 shadow-lg ", children: [(0, jsx_runtime_1.jsxs)("h1", { className: "absolute left-3 top-3 text-black font-bold text-3xl", children: ["Wealth ", (0, jsx_runtime_1.jsx)("span", { className: "text-yellow-400", children: "Pilot" })] }), (0, jsx_runtime_1.jsx)("div", { className: 'border-2 absolute right-20 top-2  border-gray-300 rounded px-4 py-2 cursor-pointer', children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setIsModalOpen(true), className: "cursor-pointer text-black", children: "Add Transaction" }), (0, jsx_runtime_1.jsx)(addTransaction_1.default, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), onTransactionAdded: handleTransactionAdded })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 absolute top-2 right-4 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition", children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 20 }) })] }));
}
//# sourceMappingURL=header.js.map