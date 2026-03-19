"use client";
import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/app/lib/api";

export default function SignupCard() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      console.log({ username, email, password });

      // ✅ apiCall already handles errors, just await the response
      const response = await apiCall("/api/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });

      console.log("Signup successful:", response);

      // ✅ If we reach here, signup was successful
      // Store token if backend returns one
      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }

      // ✅ Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      // ✅ If any error occurs, display it
      const errorMessage = error instanceof Error ? error.message : "Signup failed";
      setError(errorMessage);
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    router.push("/auth/google");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100"
     style={{
                backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.22) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
            }}>
      <div className="bg-white shadow-2xl rounded-3xl w-96 p-6 max-h-fit overflow-y-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-yellow-400">Signup</h1>
          <p className="text-gray-500 text-xs mt-1">Create your Invest Planner account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name Input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="John Doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-black text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-black text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-black text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-black text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start gap-2 mt-2">
            <input
              type="checkbox"
              id="terms"
              className="w-3.5 h-3.5 mt-0.5 border border-gray-300 rounded accent-blue-600"
              required
            />
            <label htmlFor="terms" className="text-xs text-gray-600 leading-tight">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => router.push("/terms")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Terms of Service
              </button>
              {" "}and{" "}
              <button
                type="button"
                onClick={() => router.push("/privacy")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Privacy Policy
              </button>
            </label>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 text-sm rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-3"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500">Or signup with</span>
          </div>
        </div>

        {/* Google Sign-up Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-2 text-sm rounded-lg transition hover:bg-gray-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with google
        </button>

        {/* Login Link */}
        <p className="text-center text-xs text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
          >
            Sign in 
          </button>
        </p>
      </div>
    </div>
  );
}
