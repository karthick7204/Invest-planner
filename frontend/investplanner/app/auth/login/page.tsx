'use client';

import Link from 'next/link';
import LoginCard from './loginCard';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-[#fafafa] flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      {/* Top Bar */}
      <header className="w-full px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
            <span>S</span>
          </div>
          <span className="font-semibold text-sm tracking-tight text-neutral-900 group-hover:text-black transition">
            Spendly
          </span>
        </Link>
 
        <Link
          href="/"
          className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition flex items-center gap-1.5"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <LoginCard />
      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-6 text-center font-mono text-[11px] text-neutral-400">
        © 2026 Spendly Inc. All rights reserved.
      </footer>
    </div>
  );
}