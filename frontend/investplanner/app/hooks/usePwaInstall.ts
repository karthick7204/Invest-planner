'use client';

import { useState, useEffect, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Global module-level reference to ensure beforeinstallprompt is never missed
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<(prompt: BeforeInstallPromptEvent | null) => void>();

// Attach global listener immediately when running in browser
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault(); // Suppress automatic browser mini-infobar
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    
    // Save on window for global access
    (window as unknown as { __deferredPrompt?: BeforeInstallPromptEvent }).__deferredPrompt = globalDeferredPrompt;

    promptListeners.forEach((listener) => listener(globalDeferredPrompt));
  });

  window.addEventListener('appinstalled', () => {
    globalDeferredPrompt = null;
    (window as unknown as { __deferredPrompt?: BeforeInstallPromptEvent | null }).__deferredPrompt = null;
    promptListeners.forEach((listener) => listener(null));
    console.log('[PWA] Successfully installed into system');
  });
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    () => globalDeferredPrompt
  );

  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  });

  const [isIOS] = useState(() => {
    if (typeof window === 'undefined') return false;
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
    return isIosDevice && isSafari;
  });

  const [isInstallable, setIsInstallable] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (globalDeferredPrompt) return true;
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
    return isIosDevice && isSafari;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Subscribe to external global prompt events (safe callback subscription)
    const handlePromptChange = (prompt: BeforeInstallPromptEvent | null) => {
      setDeferredPrompt(prompt);
      if (prompt) {
        setIsInstallable(true);
      }
    };

    promptListeners.add(handlePromptChange);

    // Listen to media query changes (e.g. user launches as standalone)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleDisplayModeChange);
    }

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      promptListeners.delete(handlePromptChange);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      }
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstallPrompt = useCallback(async (): Promise<'accepted' | 'dismissed' | 'ios'> => {
    if (isIOS) {
      return 'ios';
    }

    const promptToUse = deferredPrompt || globalDeferredPrompt;
    if (!promptToUse) {
      console.warn('[PWA] No install prompt event available');
      return 'dismissed';
    }

    await promptToUse.prompt();
    const { outcome } = await promptToUse.userChoice;

    if (outcome === 'accepted') {
      globalDeferredPrompt = null;
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsInstalled(true);
    }

    return outcome;
  }, [deferredPrompt, isIOS]);

  return {
    isInstallable,
    isInstalled,
    isIOS,
    triggerInstallPrompt,
  };
}
