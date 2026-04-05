"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const navigation_1 = require("next/navigation");
const api_1 = require("@/app/lib/api");
function LoginCard() {
    const [username, setUsername] = (0, react_1.useState)("");
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)("");
    const router = (0, navigation_1.useRouter)();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Add your authentication logic here
        try {
            console.log({ email, password });
            // ✅ apiCall already handles errors, just await the response
            const response = await (0, api_1.apiCall)("api/login", {
                method: "POST",
                body: JSON.stringify({ username, email, password }),
            });
            console.log("Login successful:", response);
            // ✅ If we reach here, login was successful
            // Store token and userId if backend returns them
            const token = response.token || response.data?.token;
            const userData = response.userdata || response.data?.userdata || response.data?.saveduser;
            const userId = userData?._id || response.userId || response.data?.userId;
            if (token) {
                localStorage.setItem("authToken", token);
                console.log("✅ Token saved to localStorage");
            }
            if (userId) {
                localStorage.setItem("userId", userId);
                console.log("✅ UserId saved to localStorage:", userId);
            }
            console.log("✅ Identity Verify:", localStorage.getItem("authToken") ? "Token exists" : "No token", localStorage.getItem("userId"));
            // ✅ Navigate to dashboard
            router.push("/dashboard");
        }
        catch (error) {
            // ✅ If any error occurs, display it
            const errorMessage = error instanceof Error ? error.message : "Login failed";
            setError(errorMessage);
            console.error("Login error:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleGoogleLogin = () => {
        // Add Google OAuth logic here
        console.log("Google login clicked");
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center min-h-screen", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-2xl rounded-3xl w-96 p-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8 flex flex-col items-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold text-yellow-400", children: "Login" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 text-sm mt-2", children: "Welcome back to Invest Planner" })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-5", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Full Name" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "absolute left-3 top-2.5 text-gray-400", size: 18 }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Rahuman dakait", value: username, onChange: (e) => setUsername(e.target.value), className: "w-full pl-10 pr-4 py-2 text-black text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition", required: true })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "absolute left-3 top-3.5 text-gray-400", size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "email", placeholder: "you@example.com", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full pl-10 pr-4 py-2.5 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition", required: true })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Password" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "absolute left-3 top-3.5 text-gray-400", size: 20 }), (0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full pl-10 pr-4 py-2.5 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition", required: true })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-right", children: (0, jsx_runtime_1.jsx)("a", { href: "#", className: "text-sm text-blue-600 hover:text-blue-700 font-medium", children: "Forgot password?" }) }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading, className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 cursor-pointer rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? "Signing in..." : "Continue" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative my-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 flex items-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-full border-t border-gray-300" }) }), (0, jsx_runtime_1.jsx)("div", { className: "relative flex justify-center text-sm", children: (0, jsx_runtime_1.jsx)("span", { className: "px-2 bg-white text-gray-500", children: "Or continue with" }) })] }), (0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: handleGoogleLogin, className: "w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-2.5 rounded-lg transition hover:bg-gray-50", children: [(0, jsx_runtime_1.jsxs)("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("path", { fill: "currentColor", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }), (0, jsx_runtime_1.jsx)("path", { fill: "currentColor", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }), (0, jsx_runtime_1.jsx)("path", { fill: "currentColor", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }), (0, jsx_runtime_1.jsx)("path", { fill: "currentColor", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })] }), "Sign in with Google"] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-center text-sm text-gray-600 mt-6", children: ["Don't have an account?", " ", (0, jsx_runtime_1.jsx)("button", { onClick: () => router.push("/auth/signup"), className: "text-blue-600 cursor-pointer hover:text-blue-700 font-semibold", children: "Sign up" })] })] }) }));
}
//# sourceMappingURL=loginCard.js.map