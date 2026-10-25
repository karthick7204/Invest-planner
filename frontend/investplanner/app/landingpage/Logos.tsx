'use client';

export default function Logos() {
  const logos = [
    { name: 'VERCEL', letterSpacing: 'tracking-widest' },
    { name: 'STRIPE', letterSpacing: 'tracking-wider' },
    { name: 'LINEAR', letterSpacing: 'tracking-widest' },
    { name: 'RAMP', letterSpacing: 'tracking-widest' },
    { name: 'CARTA', letterSpacing: 'tracking-widest' },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto mt-24 sm:mt-28 px-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-6 border-y border-neutral-100">
        <span className="font-mono text-[10px] sm:text-[11px] tracking-wider uppercase text-neutral-400 text-center sm:text-left">
          Trusted by quantitative teams & founders at
        </span>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10">
          {logos.map((logo) => (
            <span
              key={logo.name}
              className={`font-semibold text-xs sm:text-sm text-neutral-400 hover:text-neutral-900 transition-colors select-none ${logo.letterSpacing}`}
            >
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
