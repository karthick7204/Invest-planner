'use client';

import { useState } from 'react';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/app/lib/api';
import GoogleAuthButton from '@/app/components/GoogleAuthButton';

export default function LoginCard() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiCall('api/login', {
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
          : 'Invalid credentials. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  return (
    <div className="w-full max-w-md bg-white border border-neutral-200/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 sm:p-9">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs tracking-tighter shadow-sm mb-4">
          <span>S</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
          Sign In
        </h1>
        <p className="text-neutral-500 text-xs sm:text-sm mt-1.5">
          Enter your credentials to access your terminal
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block font-mono text-[10px] tracking-wider uppercase text-neutral-500 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Alex Morgan"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs text-neutral-900 bg-neutral-50/60 border border-neutral-200 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block font-mono text-[10px] tracking-wider uppercase text-neutral-500 mb-1.5">
            Work Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 text-neutral-400" size={16} />
            <input
              type="email"
              placeholder="alex@enterprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs text-neutral-900 bg-neutral-50/60 border border-neutral-200 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block font-mono text-[10px] tracking-wider uppercase text-neutral-500">
              Password
            </label>
            <a
              href="#"
              className="text-xs text-neutral-500 hover:text-neutral-950 transition underline-offset-4 hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 text-neutral-400" size={16} />
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs text-neutral-900 bg-neutral-50/60 border border-neutral-200 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition"
              required
            />
          </div>
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
              <span>Authenticating...</span>
            </>
          ) : (
            'Continue'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-100"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
          <span className="px-3 bg-white text-neutral-400">Or continue with</span>
        </div>
      </div>

      {/* Google OAuth Button */}
      <GoogleAuthButton mode="signin" onError={(msg) => setError(msg)} />

      {/* Sign Up Navigation */}
      <p className="text-center text-xs text-neutral-500 mt-6">
        Don&apos;t have an account?{' '}
        <button
          onClick={() => router.push('/auth/signup')}
          className="text-neutral-950 font-semibold cursor-pointer underline-offset-4 hover:underline"
        >
          Sign up
        </button>
      </p>

      {/* Security Note */}
      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-center gap-2 font-mono text-[10px] text-neutral-400">
        <span>SOC-2 Type II</span>
        <span>•</span>
        <span>256-bit AES Encryption</span>
      </div>
    </div>
  );
}