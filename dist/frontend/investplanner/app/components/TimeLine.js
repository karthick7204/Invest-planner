'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLine = TimeLine;
const jsx_runtime_1 = require("react/jsx-runtime");
function TimeLine({ range, setRange }) {
    const tabs = ['Monthly', 'Quarterly', 'Yearly'];
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-1 bg-white rounded-lg gap-0", children: tabs.map((tab) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => setRange(tab.toLowerCase()), className: `flex-1 py-3 px-4 font-semibold cursor-pointer transition  ${range === tab.toLowerCase()
                ? 'bg-yellow-400 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50'}`, children: tab }, tab))) }));
}
//# sourceMappingURL=TimeLine.js.map