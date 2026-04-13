'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCcw } from 'lucide-react';
import { apiCall } from '../lib/api';

export const InsightCard = () => {
    const [insight, setInsight] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const isProduction = process.env.NODE_ENV === 'production';

    const fetchInsight = async () => {
        if (isProduction) {
            setLoading(false);
            setInsight("This feature is currently under construction for our live platform. We're fine-tuning the AI models to provide you with the most accurate financial guidance. Stay tuned!");
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error('User not authenticated');
            
            // New endpoint as requested
            const data = await apiCall(`ai/insights/${userId}`);
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
        <div className="w-full relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl transition-all hover:border-zinc-700 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Glowing Accent Line */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-violet-600 opacity-80" />
            
            <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-500/10 rounded-xl">
                        <Sparkles size={18} className="text-indigo-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 block">
                                Platform Intelligence
                            </span>
                            {isProduction && (
                                <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                    Under Construction
                                </span>
                            )}
                        </div>
                        <span className="text-sm font-bold text-zinc-200">
                            AI Executive Summary
                        </span>
                    </div>
                </div>

                
                <button 
                    onClick={fetchInsight}
                    disabled={loading}
                    className="p-2 rounded-lg bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all disabled:opacity-30"
                    title="Refresh AI Analysis"
                >
                    <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="relative">
                {loading ? (
                    <div className="space-y-3.5">
                        <div className="h-4 w-full bg-zinc-800/50 animate-pulse rounded-md" />
                        <div className="h-4 w-[95%] bg-zinc-800/50 animate-pulse rounded-md" />
                        <div className="h-4 w-[50%] bg-zinc-800/50 animate-pulse rounded-md" />
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-3 text-zinc-500 text-sm italic py-2">
                        <div className="w-1 h-1 rounded-full bg-red-500/50" />
                        {error}
                    </div>
                ) : (
                    <p className="text-zinc-300 text-[15px] leading-[1.6] font-medium tracking-tight">
                        {insight}
                    </p>
                )}
            </div>

            {/* Subtle background glow */}
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-600/5 blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-violet-600/5 blur-[60px] rounded-full pointer-events-none" />
        </div>
    );
};
