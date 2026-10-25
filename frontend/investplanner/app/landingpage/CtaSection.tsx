'use client';

import { useState } from 'react';

export default function CtaSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section id="pricing" className="w-full max-w-4xl mx-auto my-24 sm:my-32 px-4">
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 sm:p-14 text-center shadow-[0_10px_35px_rgba(0,0,0,0.03)]">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
          Experience effortless finance.
        </h2>
        <p className="text-neutral-500 text-xs sm:text-sm mt-3 max-w-md mx-auto leading-relaxed">
          Join high-performing teams mastering their balance sheet with understated monochrome elegance.
        </p>

        {submitted ? (
          <div className="mt-8 p-3.5 bg-neutral-50 border border-neutral-200 rounded-full max-w-md mx-auto font-mono text-xs text-neutral-800 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Invitation dispatched to {email}. Welcome aboard.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@domain.com"
              className="w-full sm:w-72 px-4 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-full text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-black hover:bg-neutral-800 text-white text-xs font-medium px-5 py-2.5 rounded-full cursor-pointer transition shadow-sm active:scale-95 whitespace-nowrap"
            >
              Get Access
            </button>
          </form>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-mono text-[10px] text-neutral-400">
          <span>No credit card required</span>
          <span>•</span>
          <span>SOC-2 Type II</span>
          <span>•</span>
          <span>256-bit AES</span>
        </div>
      </div>
    </section>
  );
}
