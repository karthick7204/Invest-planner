'use client';

import { useState, useEffect } from 'react';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { Download, X, Share, PlusSquare } from 'lucide-react';

export default function InstallPromptModal() {
  const { isInstallable, isInstalled, isIOS, triggerInstallPrompt } = usePwaInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

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
    setIsDismissed(true);
  };

  return (
    <>
      <aside
        aria-label="Install Invest Planner App"
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 bg-white border border-neutral-200/90 rounded-2xl shadow-2xl p-4 z-50 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-sm shrink-0">
              IP
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 text-sm leading-tight">
                Install Invest Planner
              </h3>
              <p className="text-neutral-500 text-xs mt-0.5">
                Faster launch, offline cache &amp; desktop mode.
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            aria-label="Close install prompt"
            className="text-neutral-400 hover:text-neutral-900 p-1 rounded-lg transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDismiss}
            className="flex-1 py-1.5 px-3 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition cursor-pointer"
          >
            Not now
          </button>
          <button
            onClick={handleInstallClick}
            className="flex-1 py-1.5 px-3 text-xs font-medium text-white bg-black hover:bg-neutral-800 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Download size={13} />
            Install
          </button>
        </div>
      </aside>

      {showIOSInstructions && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center border border-neutral-200">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs mb-3">
              IP
            </div>
            <h4 className="text-base font-bold text-neutral-950">Install on iOS</h4>
            <p className="text-xs text-neutral-500 mt-1 mb-4">
              Add Invest Planner to your home screen via Safari:
            </p>

            <ol className="text-left text-xs text-neutral-700 space-y-2.5 w-full bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 font-mono">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-neutral-200 text-black flex items-center justify-center font-bold text-[9px] shrink-0">
                  1
                </span>
                <span>
                  Tap <strong className="inline-flex items-center gap-1">Share <Share size={11} /></strong>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-neutral-200 text-black flex items-center justify-center font-bold text-[9px] shrink-0">
                  2
                </span>
                <span>
                  Tap <strong className="inline-flex items-center gap-1">Add to Home Screen <PlusSquare size={11} /></strong>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-neutral-200 text-black flex items-center justify-center font-bold text-[9px] shrink-0">
                  3
                </span>
                <span>Tap <strong>Add</strong> in the top-right corner.</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="mt-4 w-full py-2 bg-black text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
