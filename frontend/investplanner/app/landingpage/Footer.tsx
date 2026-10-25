'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-100 py-8 px-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
        {/* Left: Brand mark & Copyright */}
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[9px]">
            <span>IP</span>
          </div>
          <span className="font-medium text-neutral-900">Invest Planner</span>
          <span className="text-neutral-400">© 2026 Invest Planner Inc.</span>
        </div>

        {/* Right: Links */}
        <div className="flex items-center gap-6 font-normal">
          <Link href="/privacy" className="hover:text-neutral-900 transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-neutral-900 transition-colors">
            Terms
          </Link>
          <a href="#security" className="hover:text-neutral-900 transition-colors">
            Security
          </a>
          <a href="#status" className="hover:text-neutral-900 transition-colors">
            Status
          </a>
        </div>
      </div>
    </footer>
  );
}
