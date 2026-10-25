'use client';

import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';

interface HeroProps {
  onOpenInstall?: () => void;
}

export default function Hero({ onOpenInstall }: HeroProps) {
  const router = useRouter();

  return (
    <section className="w-full pt-16 sm:pt-24 pb-4 px-4 text-center">
      {/* Small Badge / Engine Tag */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-200/80 bg-neutral-50/80 text-xs font-medium text-neutral-600 mb-8 cursor-default">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
        <span className="tracking-tight">Spendly — Personal Finance &amp; Wealth Engine</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-5xl sm:text-6xl md:text-[72px] font-bold tracking-tight text-neutral-950 leading-[1.06] max-w-3xl mx-auto">
        Financial clarity,
        <br />
        elevated.
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-sm sm:text-base md:text-[17px] text-neutral-500 max-w-xl mx-auto font-normal leading-relaxed">
        Autonomous wealth intelligence, real-time expense tracking, and intelligent stock recommendations designed with pure monochrome precision.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => router.push('/auth/signup')}
          className="bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-full cursor-pointer transition shadow-sm active:scale-95"
        >
          Get Started
        </button>
        <button
          type="button"
          onClick={onOpenInstall}
          className="bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 hover:border-neutral-900 text-xs sm:text-sm font-medium px-5 py-2.5 rounded-full cursor-pointer transition flex items-center gap-2 active:scale-95 shadow-xs"
        >
          <Download size={14} className="text-neutral-500" />
          <span>Install App</span>
        </button>
      </div>
    </section>
  );
}