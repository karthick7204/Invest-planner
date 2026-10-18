"use client";

import React from "react";
import { Download, RefreshCw, Sparkles } from "lucide-react";

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
    <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-md border border-blue-100 flex items-center gap-1.5">
            <Sparkles size={12} className="text-blue-600" />
            Gemini AI Connected
          </span>
          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-md border border-emerald-100">
            MongoDB Live Sync
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Financial Report</h1>
        <p className="text-gray-500 text-sm font-medium">
          Personalized AI financial auditing, accurate spending metrics, and capital growth strategy.
        </p>
      </div>
      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        {!hasReport ? (
          <button
            onClick={onGenerate}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-2xl shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95 text-sm font-black shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={16} className={`text-amber-400 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Auditing Records..." : "Generate Report"}
          </button>
        ) : (
          <>
            {onGenerate && (
              <button
                onClick={onGenerate}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-3 rounded-2xl shadow-sm hover:bg-gray-50 hover:text-black transition-all active:scale-95 text-sm font-bold disabled:opacity-50 cursor-pointer"
                title="Regenerate AI Report"
              >
                <RefreshCw size={16} className={loading ? "animate-spin text-blue-600" : ""} />
                <span className="hidden sm:inline">Regenerate</span>
              </button>
            )}
            <button
              onClick={handleDownload}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-2xl shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95 text-sm font-black shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Download size={18} strokeWidth={2.5} />
              Export Report
            </button>
          </>
        )}
      </div>
    </div>
  );
}