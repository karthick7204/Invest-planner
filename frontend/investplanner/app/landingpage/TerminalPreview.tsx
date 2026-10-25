'use client';

import { useState } from 'react';

export default function TerminalPreview() {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
  const chartPoints = [
    { month: 'JAN', value: '$42,100', x: 20, y: 110 },
    { month: 'FEB', value: '$49,300', x: 80, y: 100 },
    { month: 'MAR', value: '$56,800', x: 140, y: 88 },
    { month: 'APR', value: '$65,400', x: 200, y: 72 },
    { month: 'MAY', value: '$74,900', x: 260, y: 55 },
    { month: 'JUN', value: '$84,290', x: 320, y: 35 },
  ];

  return (
    <div id="terminal" className="w-full max-w-4xl mx-auto mt-12 sm:mt-16">
      {/* Outer Card with subtle border and soft deep shadow */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden transition-all hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)]">
        {/* Terminal Header Bar */}
        <div className="px-5 py-3.5 bg-neutral-50/70 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300"></span>
            </div>
            <span className="font-mono text-[11px] text-neutral-400 ml-2 tracking-tight">
              invest.terminal / live-active
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-500 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SYNCHRONIZED</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {/* Top 3 KPI Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pb-8 border-b border-neutral-100">
            {/* Metric 1 */}
            <div>
              <p className="font-mono text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                Total Net Balance
              </p>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 mt-1">
                $84,290.40
              </h3>
              <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                <span className="text-neutral-900 font-medium">+18.4%</span>
                <span>compared to target</span>
              </p>
            </div>

            {/* Metric 2 */}
            <div>
              <p className="font-mono text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                Monthly Burn Velocity
              </p>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 mt-1">
                $4,120.00
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                <span className="text-neutral-900 font-medium">12.5%</span> under strict ceiling
              </p>
            </div>

            {/* Metric 3 */}
            <div>
              <p className="font-mono text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                Runway Trajectory
              </p>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 mt-1">
                28.4 mo
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Algorithmic forecast (95% CI)
              </p>
            </div>
          </div>

          {/* Lower Two-Column Section: Chart & Events Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            {/* Left: Inflow vs Outflow Trajectory Chart */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-semibold text-neutral-900 tracking-tight">
                  Inflow vs. Outflow Trajectory
                </h4>
                <span className="font-mono text-[11px] text-neutral-400">
                  H1 2026
                </span>
              </div>

              {/* Trajectory SVG */}
              <div className="relative w-full h-40 sm:h-44">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 340 130"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#000000" stopOpacity="0.06" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid guide lines */}
                  <line x1="20" y1="35" x2="330" y2="35" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="20" y1="75" x2="330" y2="75" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="20" y1="115" x2="330" y2="115" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="2 2" />

                  {/* Shaded Area under Curve */}
                  <path
                    d="M 20 110 C 70 105, 120 95, 170 80 C 220 65, 270 45, 320 35 L 320 120 L 20 120 Z"
                    fill="url(#curveGradient)"
                  />

                  {/* Baseline / Outflow projection (dotted) */}
                  <path
                    d="M 20 115 C 80 112, 160 108, 240 102 C 280 99, 320 95, 320 95"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  {/* Primary Trajectory Curve */}
                  <path
                    d="M 20 110 C 70 105, 120 95, 170 80 C 220 65, 270 45, 320 35"
                    fill="none"
                    stroke="#0a0a0a"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />

                  {/* Interactive / Static Data points */}
                  {chartPoints.map((pt, idx) => (
                    <g key={idx}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={activePoint === idx ? 4.5 : 3}
                        className="cursor-pointer transition-all fill-white stroke-black stroke-2"
                        onMouseEnter={() => setActivePoint(idx)}
                        onMouseLeave={() => setActivePoint(null)}
                      />
                    </g>
                  ))}
                </svg>

                {/* Tooltip for active hover */}
                {activePoint !== null && (
                  <div
                    className="absolute bg-neutral-950 text-white font-mono text-[10px] px-2 py-1 rounded shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-7"
                    style={{
                      left: `${(chartPoints[activePoint].x / 340) * 100}%`,
                      top: `${(chartPoints[activePoint].y / 130) * 100}%`,
                    }}
                  >
                    {chartPoints[activePoint].value}
                  </div>
                )}
              </div>

              {/* Month Axis Labels */}
              <div className="flex justify-between px-2 pt-2 border-t border-neutral-100">
                {months.map((m) => (
                  <span key={m} className="font-mono text-[10px] text-neutral-400">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Extracted Events Table */}
            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-neutral-100 lg:pl-8 pt-6 lg:pt-0">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                <span>Extracted Events</span>
                <span>Status</span>
              </div>

              <div className="divide-y divide-neutral-100/80">
                {/* Event 1 */}
                <div className="py-3.5 flex items-start justify-between gap-2 group">
                  <div>
                    <h5 className="text-xs font-medium text-neutral-900 group-hover:text-black">
                      AWS Cloud Hosting
                    </h5>
                    <p className="font-mono text-[10px] text-neutral-400 mt-0.5">
                      OCR • Category: 6021
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-medium text-neutral-900">
                      -$1,894.20
                    </span>
                    <div className="mt-1">
                      <span className="inline-block font-mono text-[9px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="py-3.5 flex items-start justify-between gap-2 group">
                  <div>
                    <h5 className="text-xs font-medium text-neutral-900 group-hover:text-black">
                      Client Retainer Inflow
                    </h5>
                    <p className="font-mono text-[10px] text-neutral-400 mt-0.5">
                      Stripe API • ARR
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-medium text-neutral-900">
                      +$18,450.00
                    </span>
                    <div className="mt-1">
                      <span className="inline-block font-mono text-[9px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="py-3.5 flex items-start justify-between gap-2 group">
                  <div>
                    <h5 className="text-xs font-medium text-neutral-900 group-hover:text-black">
                      SaaS Optimization Alert
                    </h5>
                    <p className="font-mono text-[10px] text-neutral-400 mt-0.5">
                      Aura Copilot
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-medium text-neutral-900">
                      +$240.00/mo
                    </span>
                    <div className="mt-1">
                      <span className="inline-block font-mono text-[9px] px-2 py-0.5 rounded-full bg-black text-white">
                        Actionable
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
