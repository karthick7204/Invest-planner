'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';

interface NavbarProps {
  onOpenInstall?: () => void;
}

export default function Navbar({ onOpenInstall }: NavbarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
            <span>S</span>
          </div>
          <span className="font-semibold text-sm tracking-tight text-neutral-900 group-hover:text-black transition">
            Spendly
          </span>
        </Link>


        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <button
            type="button"
            onClick={onOpenInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200/90 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-medium transition cursor-pointer active:scale-95 shadow-xs"
            title="Install Spendly PWA"
          >
            <Download size={13} className="text-neutral-500" />
            <span className="hidden xs:inline sm:inline">Install App</span>
            <span className="xs:hidden sm:hidden">Install</span>
          </button>
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
