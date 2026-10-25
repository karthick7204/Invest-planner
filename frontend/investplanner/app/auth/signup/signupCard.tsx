'use client';

import { useState } from 'react';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/app/lib/api';

export default function SignupCard() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await apiCall('/api/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });

      const token = response.token || response.data?.token;
      const userData = response.userdata || response.data?.userdata || response.data?.saveduser;
      const userId = userData?._id || response.userId || response.data?.userId;

      if (token) {
        localStorage.setItem('authToken', token);
      }

      if (userId) {
        localStorage.setItem('userId', userId);
      }

      router.push('/Dashboard');
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message.toLowerCase().includes('fetch') || err.message.toLowerCase().includes('network')
            ? 'Unable to connect to the backend server. Please verify the server on port 3002 is running.'
            : err.message
          : 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    router.push('/auth/google');
  };

  return (
    <div className="w-full max-w-md bg-white border border-neutral-200/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 sm:p-9">
      {/* Header */}
      <div className="mb-7 flex flex-col items-center text-center">
        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs tracking-tighter shadow-sm mb-4">
          <span>S</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
          Create Account
        </h1>
        <p className="text-neutral-500 text-xs sm:text-sm mt-1.5">
          Start managing your capital with monochrome precision
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-5 p-3 bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs rounded-lg font-mono flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block font-mono text-[10px] tracking-wider uppercase text-neutral-500 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Alex Morgan"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs text-neutral-900 bg-neutral-50/60 border border-neutral-200 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block font-mono text-[10px] tracking-wider uppercase text-neutral-500 mb-1">
            Work Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 text-neutral-400" size={16} />
            <input
              type="email"
              placeholder="alex@enterprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs text-neutral-900 bg-neutral-50/60 border border-neutral-200 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block font-mono text-[10px] tracking-wider uppercase text-neutral-500 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 text-neutral-400" size={16} />
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs text-neutral-900 bg-neutral-50/60 border border-neutral-200 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition"
              required
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block font-mono text-[10px] tracking-wider uppercase text-neutral-500 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 text-neutral-400" size={16} />
            <input
              type="password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs text-neutral-900 bg-neutral-50/60 border border-neutral-200 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition"
              required
            />
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="terms"
            className="w-3.5 h-3.5 mt-0.5 border border-neutral-300 rounded accent-black cursor-pointer"
            required
          />
          <label htmlFor="terms" className="text-[11px] text-neutral-500 leading-tight">
            I agree to the{' '}
            <button
              type="button"
              onClick={() => router.push('/terms')}
              className="text-neutral-900 font-medium hover:underline cursor-pointer"
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => router.push('/privacy')}
              className="text-neutral-900 font-medium hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-black hover:bg-neutral-800 text-white font-medium text-xs py-2.5 rounded-lg cursor-pointer transition shadow-sm active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-100"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
          <span className="px-3 bg-white text-neutral-400">Or signup with</span>
        </div>
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignup}
        className="w-full flex items-center justify-center gap-2.5 bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-medium text-xs py-2.5 rounded-lg transition cursor-pointer active:scale-[0.99]"
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
        <span>Sign in with Google</span>
      </button>

      {/* Login Navigation */}
      <p className="text-center text-xs text-neutral-500 mt-5">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => router.push('/auth/login')}
          className="text-neutral-950 font-semibold cursor-pointer underline-offset-4 hover:underline"
        >
          Sign in
        </button>
      </p>

      {/* Security Note */}
      <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-center gap-2 font-mono text-[10px] text-neutral-400">
        <span>SOC-2 Type II</span>
        <span>•</span>
        <span>256-bit AES Encryption</span>
      </div>
    </div>
  );
}
