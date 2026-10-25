'use client';

import { useState, useEffect } from 'react';
import { Sparkles, RefreshCcw } from 'lucide-react';
import { apiCall } from '../lib/api';

export const InsightCard = () => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsight = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User not authenticated');

      const data = await apiCall(`api/ai/insights/${userId}`);
      setInsight(data.insight);
    } catch (err: unknown) {
      console.error('Error fetching AI insights:', err);
      const message = err instanceof Error ? err.message : 'Could not load AI insights.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsight();
  }, []);

  return (
    <div className="w-full relative overflow-hidden bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-neutral-100 rounded-xl text-neutral-900">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block">
              Autonomous Intelligence
            </span>
            <span className="text-sm font-semibold text-neutral-950 tracking-tight">
              AI Financial Copilot
            </span>
          </div>
        </div>

        <button
          onClick={fetchInsight}
          disabled={loading}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition disabled:opacity-30 cursor-pointer"
          title="Refresh Analysis"
        >
          <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="relative font-mono text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-200/60">
        {loading ? (
          <div className="space-y-2">
            <div className="h-3 w-full bg-neutral-200/70 animate-pulse rounded" />
            <div className="h-3 w-4/5 bg-neutral-200/70 animate-pulse rounded" />
            <div className="h-3 w-1/2 bg-neutral-200/70 animate-pulse rounded" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-neutral-500 italic">
            <span>{error}</span>
          </div>
        ) : (
          <p>{insight}</p>
        )}
      </div>
    </div>
  );
};
