'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
            <span>IP</span>
          </div>
          <span className="font-semibold text-sm tracking-tight text-neutral-900 group-hover:text-black transition">
            Invest Planner
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-normal text-neutral-500">
          <a href="#features" className="hover:text-neutral-950 transition-colors">
            Product
          </a>
          <a href="#features" className="hover:text-neutral-950 transition-colors">
            Features
          </a>
          <a href="#terminal" className="hover:text-neutral-950 transition-colors">
            Architecture
          </a>
          <a href="#pricing" className="hover:text-neutral-950 transition-colors">
            Pricing
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/auth/login')}
            className="text-[13px] font-medium text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer px-2 py-1"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push('/auth/signup')}
            className="bg-black hover:bg-neutral-800 text-white text-xs font-medium px-4 py-2 rounded-full cursor-pointer transition shadow-sm active:scale-95"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
