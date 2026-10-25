'use client';

import Navbar from './Navbar';
import Hero from './hero';
import TerminalPreview from './TerminalPreview';
import Logos from './Logos';
import Pillars from './Pillars';
import Testimonial from './Testimonial';
import CtaSection from './CtaSection';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col selection:bg-neutral-900 selection:text-white">
      {/* Top Header */}
      <Navbar />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Interactive Terminal Mockup */}
        <div className="px-4">
          <TerminalPreview />
        </div>

        {/* Social Proof Logos */}
        <Logos />

        {/* Simplicity First - 3 Feature Pillars */}
        <Pillars />

        {/* Customer Testimonial Quote */}
        <Testimonial />

        {/* Experience Effortless Finance - Bottom CTA Card */}
        <CtaSection />
      </main>

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
}