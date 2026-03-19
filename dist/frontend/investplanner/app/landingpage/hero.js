'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Hero;
const jsx_runtime_1 = require("react/jsx-runtime");
const navigation_1 = require("next/navigation");
function Hero() {
    const router = (0, navigation_1.useRouter)();
    const login = () => {
        router.push("/auth/login");
    };
    const signup = () => {
        router.push("/auth/signup");
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "absolute top-45", children: [(0, jsx_runtime_1.jsxs)("h1", { className: "text-black font-bold text-6xl", children: ["Wealth ", (0, jsx_runtime_1.jsx)("span", { className: "text-yellow-400", children: "Pilot" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 ml-6 mt-2", children: "Smart way to manage your financial life." }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 flex flex-row items-center justify-center gap-4", children: [(0, jsx_runtime_1.jsx)("button", { className: "text-black border-2 border-black bg-[#f6f7f6] px-4 py-2 rounded-2xl cursor-pointer hover:bg-[#e0e0e0]", onClick: login, children: "Login" }), (0, jsx_runtime_1.jsx)("button", { className: "text-black border-2 border-black bg-[#f6f7f6] px-4 py-2 rounded-2xl cursor-pointer hover:bg-[#e0e0e0]", onClick: signup, children: "Sign Up" })] }), (0, jsx_runtime_1.jsx)("div", {})] }));
}
//# sourceMappingURL=hero.js.map