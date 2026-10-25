'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import Hero from './hero';
import TerminalPreview from './TerminalPreview';
import Pillars from './Pillars';
import CtaSection from './CtaSection';
import Footer from './Footer';
import InstallPromptModal from '../components/InstallPromptModal';

export default function LandingPage() {
  const [isInstallOpen, setIsInstallOpen] = useState(false);

  const handleOpenInstall = () => {
    setIsInstallOpen(true);
  };

  const handleCloseInstall = () => {
    setIsInstallOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col selection:bg-neutral-900 selection:text-white">
      {/* Top Header with permanent Download button */}
      <Navbar onOpenInstall={handleOpenInstall} />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Hero Section with permanent Download App CTA */}
        <Hero onOpenInstall={handleOpenInstall} />

        {/* Interactive Terminal Mockup */}
        <div className="px-4">
          <TerminalPreview />
        </div>

        {/* Simplicity First - 3 Feature Pillars */}
        <Pillars />

        {/* Experience Effortless Finance - Bottom CTA Card with integrated Install row */}
        <CtaSection onOpenInstall={handleOpenInstall} />
      </main>

      {/* Minimal Footer */}
      <Footer />

      {/* Dedicated Install Modal for the Landing Page */}
      <InstallPromptModal isOpen={isInstallOpen} onClose={handleCloseInstall} />
    </div>
  );
}