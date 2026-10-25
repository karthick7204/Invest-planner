'use client';

import { Heart, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-100 py-8 px-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        {/* Left: Brand mark & Copyright */}
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[9px]">
            <span>S</span>
          </div>
          <span className="font-semibold text-neutral-900 tracking-tight">Spendly</span>
          <span className="text-neutral-400">© 2026</span>
        </div>

        {/* Center: Made with love */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
          <span>Made with love</span>
          <Heart size={13} className="text-red-500 fill-red-500 inline-block animate-pulse" />
        </div>

        {/* Right: GitHub Link */}
        <div className="flex items-center">
          <a
            href="https://github.com/karthick7204/Invest-planner"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-900 hover:text-neutral-950 text-neutral-700 bg-white hover:bg-neutral-50 transition-all font-mono text-xs font-medium active:scale-95 shadow-2xs group"
          >
            <Github size={14} className="text-neutral-700 group-hover:text-black transition-colors" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
