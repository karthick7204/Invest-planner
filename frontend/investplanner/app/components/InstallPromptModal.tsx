'use client';

import React, { useState, useEffect } from 'react';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { Download, X, Share, PlusSquare } from 'lucide-react';

export default function InstallPromptModal() {
  const { isInstallable, isInstalled, isIOS, triggerInstallPrompt } = usePwaInstall();

  // In-memory dismissal only: disappears for this view, reappears on page refresh/reload
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // Clear any legacy localStorage/sessionStorage keys that previously hid the modal permanently
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('spendly_pwa_dismissed');
      sessionStorage.removeItem('spendly_pwa_dismissed');
    }
  }, []);

  const showPrompt = isInstallable && !isInstalled && !isDismissed;

  if (!showPrompt) return null;

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    const outcome = await triggerInstallPrompt();
    if (outcome === 'accepted') {
      setIsDismissed(true);
    }
  };

  const handleDismiss = () => {
    // Only hides for current page view without touching localStorage/sessionStorage
    setIsDismissed(true);
  };

  return (
    <>
      {/* Floating Install Prompt Banner */}
      <aside
        aria-label="Install Spendly App"
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 z-50 flex flex-col gap-3 transition-all animate-in fade-in slide-in-from-bottom-5 duration-300"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center font-bold text-black text-xl shadow-sm shrink-0">
              Sp
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                Install Spendly App
              </h3>
              <p className="text-gray-500 text-xs mt-0.5">
                Faster launch, offline access & standalone mode.
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            aria-label="Close install prompt"
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDismiss}
            className="flex-1 py-2 px-3 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
          >
            Not now
          </button>
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2 px-3 text-xs font-semibold text-black bg-yellow-400 hover:bg-yellow-500 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Download size={14} />
            Install
          </button>
        </div>
      </aside>

      {/* iOS Safari Instruction Modal */}
      {showIOSInstructions && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center text-black font-bold text-xl mb-3">
              Sp
            </div>
            <h4 className="text-lg font-bold text-gray-900">Install Spendly on iOS</h4>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Follow these simple steps in Safari to add Spendly to your home screen:
            </p>

            <ol className="text-left text-xs text-gray-700 space-y-3 w-full bg-gray-50 p-4 rounded-xl border border-gray-100">
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-gray-200 text-black flex items-center justify-center font-bold text-[10px] shrink-0">
                  1
                </span>
                <span>
                  Tap the <strong className="inline-flex items-center gap-1">Share <Share size={12} /></strong> icon in Safari.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-gray-200 text-black flex items-center justify-center font-bold text-[10px] shrink-0">
                  2
                </span>
                <span>
                  Scroll down and tap <strong className="inline-flex items-center gap-1">Add to Home Screen <PlusSquare size={12} /></strong>.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-gray-200 text-black flex items-center justify-center font-bold text-[10px] shrink-0">
                  3
                </span>
                <span>Tap <strong>Add</strong> in the top-right corner.</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="mt-5 w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
