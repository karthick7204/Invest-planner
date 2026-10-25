'use client';

import { useState } from 'react';
import Link from 'next/link';
import AddTransactionModal from '../modals/addTransaction';
import { User, Download, Plus } from 'lucide-react';
import { usePwaInstall } from '../hooks/usePwaInstall';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isInstallable, isInstalled, triggerInstallPrompt } = usePwaInstall();

  const handleTransactionAdded = () => {
    console.log('✅ Transaction added successfully');
  };

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 sticky top-0 z-50">
      {/* Brand Logo */}
      <Link href="/Dashboard" className="flex items-center gap-2.5 group">
        <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
          <span>S</span>
        </div>
        <span className="font-semibold text-sm sm:text-base tracking-tight text-neutral-950">
          Spendly
        </span>
      </Link>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Install App Quick Action */}
        {isInstallable && !isInstalled && (
          <button
            onClick={triggerInstallPrompt}
            className="flex items-center gap-1.5 border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer active:scale-95"
            aria-label="Install Spendly Application"
          >
            <Download size={14} className="text-neutral-600" />
            <span className="hidden sm:inline">Install App</span>
            <span className="sm:hidden">Install</span>
          </button>
        )}

        {/* Add Transaction Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white rounded-lg px-3.5 py-1.5 text-xs font-medium transition cursor-pointer shadow-sm active:scale-95"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>

        {/* User Profile Icon */}
        <div className="w-8 h-8 rounded-full border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 flex items-center justify-center cursor-pointer transition text-neutral-700 active:scale-95">
          <User size={16} />
        </div>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={handleTransactionAdded}
      />
    </header>
  );
}