'use client';

export default function Pillars() {
  return (
    <section id="features" className="w-full max-w-5xl mx-auto mt-28 sm:mt-36 px-4">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="font-mono text-[11px] tracking-widest uppercase text-neutral-400 block">
          Simplicity First
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 mt-3">
          Engineered for minimal friction.
        </h2>
        <p className="text-neutral-500 text-sm sm:text-base mt-3 leading-relaxed">
          Three refined pillars delivering complete capital orchestration without noisy dashboards.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 mt-14 sm:mt-16">
        {/* Pillar Card 1 */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
          <div>
            {/* Minimal Icon */}
            <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 mb-6 group-hover:bg-black group-hover:text-white transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 21h10a2 2 0 0 0 2-2V9l-5-5H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
                <path d="M14 2v6h6" />
                <path d="M10 13h4" />
                <path d="M10 17h4" />
              </svg>
            </div>

            <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
              Expense &amp; Inflow Tracking
            </h3>
            <p className="text-xs text-neutral-500 mt-2.5 leading-relaxed">
              Instant logging and automatic categorization across Food, Dining, Travel, Utilities, and Salary inflows keep your finances transparent.
            </p>
          </div>

          {/* Mini Preview Box */}
          <div className="mt-8 pt-4 border-t border-neutral-100">
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-lg px-3.5 py-2.5 flex items-center justify-between font-mono text-[11px]">
              <span className="text-neutral-700 font-medium">Food &amp; Groceries</span>
              <span className="text-neutral-500">₹4,850 Verified</span>
            </div>
          </div>
        </div>

        {/* Pillar Card 2 */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
          <div>
            {/* Minimal Icon */}
            <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 mb-6 group-hover:bg-black group-hover:text-white transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 20V10" />
                <path d="M12 20V4" />
                <path d="M6 20v-6" />
              </svg>
            </div>

            <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
              Budget Guardrails &amp; Surplus
            </h3>
            <p className="text-xs text-neutral-500 mt-2.5 leading-relaxed">
              Real-time monthly spending caps and surplus velocity track your spending ceiling so you always maintain a healthy cash reserve.
            </p>
          </div>

          {/* Mini Preview Box */}
          <div className="mt-8 pt-4 border-t border-neutral-100">
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-lg p-3 font-mono text-[11px]">
              <div className="flex items-center justify-between text-neutral-700">
                <span>Monthly Surplus</span>
                <span className="font-medium text-neutral-900">₹82,450 Retained</span>
              </div>
              {/* Segmented Runway Bar */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="h-1.5 flex-1 rounded-sm bg-neutral-900"></span>
                <span className="h-1.5 flex-1 rounded-sm bg-neutral-900"></span>
                <span className="h-1.5 flex-1 rounded-sm bg-neutral-900"></span>
                <span className="h-1.5 flex-1 rounded-sm bg-neutral-300"></span>
                <span className="h-1.5 flex-1 rounded-sm bg-neutral-200"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar Card 3 */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
          <div>
            {/* Minimal Icon */}
            <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 mb-6 group-hover:bg-black group-hover:text-white transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>

            <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
              Gemini AI &amp; Stock Intelligence
            </h3>
            <p className="text-xs text-neutral-500 mt-2.5 leading-relaxed">
              Intelligent financial advisory analyzes excess surplus and curates high-conviction Indian equity allocations with real-time NSE data.
            </p>
          </div>

          {/* Mini Preview Box */}
          <div className="mt-8 pt-4 border-t border-neutral-100">
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-lg p-3 font-mono text-[11px]">
              <div className="text-neutral-500 truncate">
                &ldquo;Allocate monthly surplus&rdquo;
              </div>
              <div className="text-neutral-900 font-medium mt-1 truncate">
                Tata Motors (NSE) • ₹15,000 Allocation
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
