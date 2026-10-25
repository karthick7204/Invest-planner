'use client';

import { Download, RefreshCw, Sparkles } from 'lucide-react';

interface ReportHeaderProps {
  onExport?: () => void;
  onGenerate?: () => void | Promise<void>;
  hasReport?: boolean;
  loading?: boolean;
}

export function ReportHeader({
  onExport,
  onGenerate,
  hasReport = false,
  loading = false,
}: ReportHeaderProps) {
  const handleDownload = () => {
    if (onExport) {
      onExport();
    } else {
      window.print();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4 pb-2 border-b border-neutral-200/60">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-800 text-[10px] font-mono uppercase tracking-wider rounded-md border border-neutral-200 flex items-center gap-1.5">
            <Sparkles size={11} className="text-neutral-700" />
            Gemini AI Connected
          </span>
          <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-800 text-[10px] font-mono uppercase tracking-wider rounded-md border border-neutral-200">
            MongoDB Live Sync
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight mt-1">
          Financial Report
        </h1>
        <p className="text-neutral-500 text-xs sm:text-sm font-normal">
          AI financial audit, spending metrics, and capital growth strategy.
        </p>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {!hasReport ? (
          <button
            onClick={onGenerate}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-neutral-800 transition active:scale-95 text-xs font-medium cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Auditing Records...' : 'Generate Report'}
          </button>
        ) : (
          <>
            {onGenerate && (
              <button
                onClick={onGenerate}
                disabled={loading}
                className="flex items-center justify-center gap-1.5 bg-white text-neutral-800 border border-neutral-200 px-3.5 py-2 rounded-xl shadow-sm hover:bg-neutral-50 transition text-xs font-mono disabled:opacity-50 cursor-pointer"
                title="Regenerate AI Report"
              >
                <RefreshCw size={13} className={loading ? 'animate-spin text-black' : ''} />
                <span className="hidden sm:inline">Regenerate</span>
              </button>
            )}
            <button
              onClick={handleDownload}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-5 py-2 rounded-xl shadow-sm hover:bg-neutral-800 transition active:scale-95 text-xs font-medium cursor-pointer disabled:opacity-50"
            >
              <Download size={14} />
              Export Report
            </button>
          </>
        )}
      </div>
    </div>
  );
}