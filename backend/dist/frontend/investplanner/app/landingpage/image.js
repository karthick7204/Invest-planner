"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LandingImage;
const jsx_runtime_1 = require("react/jsx-runtime");
const image_1 = __importDefault(require("next/image"));
function LandingImage() {
    return ((0, jsx_runtime_1.jsx)(image_1.default, { className: "rounded-2xl shadow-black-2000", src: "/landingImage.png", alt: "Landing Page Image", width: 1200, height: 600 }));
}
//# sourceMappingURL=image.js.map