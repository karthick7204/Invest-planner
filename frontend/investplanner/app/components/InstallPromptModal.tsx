'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { Download, X, Share, PlusSquare, Monitor, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstallPromptModal({ isOpen, onClose }: InstallPromptModalProps) {
  const { isInstalled, isIOS, triggerInstallPrompt } = usePwaInstall();
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'installed' | 'manual'>('idle');

  // Handle escape key and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePwaInstall = async () => {
    if (isIOS) {
      setInstallStatus('manual');
      return;
    }

    setInstallStatus('installing');
    try {
      const outcome = await triggerInstallPrompt();
      if (outcome === 'accepted') {
        setInstallStatus('installed');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setInstallStatus('manual');
      }
    } catch {
      setInstallStatus('manual');
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-install-title"
        className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200/90 pointer-events-auto flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start border-b border-neutral-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-sm shrink-0">
              S
            </div>
            <div>
              <h2 id="pwa-install-title" className="text-base font-semibold text-neutral-950 tracking-tight">
                Install Spendly PWA
              </h2>
              <p className="font-mono text-xs text-neutral-400 mt-0.5">
                Progressive Web Application
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 gap-2.5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50/70 border border-neutral-200/80">
              <div className="w-8 h-8 rounded-lg bg-neutral-200/60 flex items-center justify-center text-neutral-800 shrink-0">
                <Zap size={15} />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-900">Instant Launch</p>
                <p className="text-[11px] text-neutral-500">Opens directly from your system Dock or Home Screen</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50/70 border border-neutral-200/80">
              <div className="w-8 h-8 rounded-lg bg-neutral-200/60 flex items-center justify-center text-neutral-800 shrink-0">
                <Monitor size={15} />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-900">Dedicated Window</p>
                <p className="text-[11px] text-neutral-500">Distraction-free standalone app mode without browser tabs</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50/70 border border-neutral-200/80">
              <div className="w-8 h-8 rounded-lg bg-neutral-200/60 flex items-center justify-center text-neutral-800 shrink-0">
                <ShieldCheck size={15} />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-900">Offline Ready</p>
                <p className="text-[11px] text-neutral-500">Fast local caching and encrypted session storage</p>
              </div>
            </div>
          </div>

          {/* Installed Confirmation State */}
          {installStatus === 'installed' || isInstalled ? (
            <div className="p-3.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-xs text-neutral-800 flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Spendly PWA is successfully installed on your device.</span>
            </div>
          ) : null}

          {/* PWA Download / Install Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handlePwaInstall}
              disabled={installStatus === 'installing'}
              className="w-full py-2.5 px-4 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99] cursor-pointer"
            >
              <Download size={14} />
              <span>{installStatus === 'installing' ? 'Initiating PWA Download...' : 'Download & Install PWA'}</span>
            </button>
          </div>

          {/* Platform Manual Guidance (shown on iOS or when browser requires manual action) */}
          {(installStatus === 'manual' || isIOS) && (
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/90 space-y-2 text-left animate-in fade-in duration-150">
              {isIOS ? (
                <>
                  <p className="text-xs font-medium text-neutral-900">Install via Safari iOS:</p>
                  <ol className="text-[11px] text-neutral-600 space-y-1 font-mono">
                    <li className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-neutral-200 text-black flex items-center justify-center font-bold text-[9px] shrink-0">1</span>
                      <span>Tap <strong className="inline-flex items-center gap-0.5">Share <Share size={10} /></strong> in Safari</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-neutral-200 text-black flex items-center justify-center font-bold text-[9px] shrink-0">2</span>
                      <span>Tap <strong className="inline-flex items-center gap-0.5">Add to Home Screen <PlusSquare size={10} /></strong></span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-neutral-200 text-black flex items-center justify-center font-bold text-[9px] shrink-0">3</span>
                      <span>Tap <strong>Add</strong> in the top-right corner.</span>
                    </li>
                  </ol>
                </>
              ) : (
                <>
                  <p className="text-xs font-medium text-neutral-900">Browser Installation:</p>
                  <p className="text-[11px] text-neutral-600 font-mono">
                    Look for the <strong>Install (⊕ or ⬇)</strong> icon in your browser URL bar at the top right, and click <strong>Install</strong>.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
