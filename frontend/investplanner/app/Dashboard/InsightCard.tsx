'use client';

import React, { useState, useEffect } from 'react';
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
        } catch (err: any) {
            console.error('Error fetching AI insights:', err);
            setError('Could not load AI insights.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsight();
    }, []);

    return (
        <div className="w-full relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl transition-all hover:border-zinc-700">
            {/* Glowing Accent Line */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-violet-600 opacity-80" />
            
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                        <Sparkles size={16} className="text-indigo-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        AI Insights
                    </span>
                </div>
                
                <button 
                    onClick={fetchInsight}
                    disabled={loading}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-30"
                >
                    <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="relative">
                {loading ? (
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-zinc-800 animate-pulse rounded" />
                        <div className="h-4 w-[90%] bg-zinc-800 animate-pulse rounded" />
                        <div className="h-4 w-[40%] bg-zinc-800 animate-pulse rounded" />
                    </div>
                ) : error ? (
                    <p className="text-zinc-500 text-sm italic">{error}</p>
                ) : (
                    <p className="text-zinc-300 text-sm leading-relaxed font-medium">
                        {insight}
                    </p>
                )}
            </div>

            {/* Subtle background glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-600/5 blur-[50px] rounded-full pointer-events-none" />
        </div>
    );
};
