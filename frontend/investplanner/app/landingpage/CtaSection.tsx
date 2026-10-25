'use client';

import { useRouter } from 'next/navigation';
import { Download, ArrowRight, Wallet, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

interface CtaSectionProps {
  onOpenInstall?: () => void;
}

export default function CtaSection({ onOpenInstall }: CtaSectionProps) {
  const router = useRouter();

  return (
    <section id="pricing" className="w-full max-w-4xl mx-auto my-24 sm:my-32 px-4">
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 sm:p-14 text-center shadow-[0_10px_35px_rgba(0,0,0,0.03)]">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-[11px] font-mono text-neutral-600 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Spendly Wealth Intelligence</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
          Master your money with Spendly.
        </h2>
        <p className="text-neutral-500 text-xs sm:text-sm mt-3.5 max-w-xl mx-auto leading-relaxed">
          Spendly combines real-time cash flow tracking, monthly budget discipline, Gemini AI advisory, and Indian stock suggestions into one seamless, distraction-free monochrome workspace.
        </p>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-2xl mx-auto text-left">
          <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100 flex flex-col gap-1.5">
            <Wallet size={16} className="text-neutral-800" />
            <span className="text-xs font-semibold text-neutral-900">Cash Flow Tracking</span>
            <span className="text-[11px] text-neutral-500 leading-tight">Income, expenses &amp; net surplus</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100 flex flex-col gap-1.5">
            <ShieldCheck size={16} className="text-neutral-800" />
            <span className="text-xs font-semibold text-neutral-900">Budget Limits</span>
            <span className="text-[11px] text-neutral-500 leading-tight">Strict caps &amp; burn protection</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100 flex flex-col gap-1.5">
            <Sparkles size={16} className="text-neutral-800" />
            <span className="text-xs font-semibold text-neutral-900">Gemini AI Copilot</span>
            <span className="text-[11px] text-neutral-500 leading-tight">Tailored savings &amp; surplus advice</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100 flex flex-col gap-1.5">
            <TrendingUp size={16} className="text-neutral-800" />
            <span className="text-xs font-semibold text-neutral-900">Stock Suggestions</span>
            <span className="text-[11px] text-neutral-500 leading-tight">Curated NSE equity ideas</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => router.push('/auth/signup')}
            className="bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-medium px-6 py-2.5 rounded-full cursor-pointer transition shadow-sm active:scale-95 flex items-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight size={14} />
          </button>
          <button
            type="button"
            onClick={onOpenInstall}
            className="bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 hover:border-neutral-900 text-xs sm:text-sm font-medium px-5 py-2.5 rounded-full cursor-pointer transition flex items-center gap-2 active:scale-95 shadow-xs"
          >
            <Download size={14} className="text-neutral-500" />
            <span>Install App</span>
          </button>
        </div>

        {/* Integrated Install & PWA Footer Row */}
        <div className="mt-10 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
              S
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900">Spendly Progressive Web App</p>
              <p className="text-[11px] text-neutral-400">Install directly to your mobile home screen or desktop dock for offline speed.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenInstall}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-900 text-xs font-medium transition cursor-pointer active:scale-95 shadow-xs whitespace-nowrap"
          >
            <Download size={13} className="text-neutral-500" />
            <span>Install Now</span>
          </button>
        </div>
      </div>
    </section>
  );
}
