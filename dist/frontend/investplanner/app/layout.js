"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
require("./globals.css");
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
    return ((0, jsx_runtime_1.jsx)("body", { children: children }));
}
//# sourceMappingURL=layout.js.map