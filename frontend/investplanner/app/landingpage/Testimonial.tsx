'use client';

export default function Testimonial() {
  return (
    <section className="w-full mt-28 sm:mt-36 py-20 sm:py-24 bg-neutral-50/70 border-y border-neutral-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <blockquote className="text-lg sm:text-2xl md:text-[26px] font-normal text-neutral-900 leading-snug tracking-tight max-w-3xl mx-auto">
          &ldquo;Invest Planner stripped away all the visual clutter typical in finance apps. It is quiet, fast, and does in seconds what previously demanded weekend bookkeeping.&rdquo;
        </blockquote>

        <p className="mt-6 text-xs sm:text-sm text-neutral-500 font-normal">
          <span className="font-semibold text-neutral-900">Devon Vance</span> — Founder &amp; CEO, HyperScale Systems
        </p>
      </div>
    </section>
  );
}
