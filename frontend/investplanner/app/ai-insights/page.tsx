'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingDown, Target, Zap, ArrowUpRight, Brain, ShieldCheck, PieChart, AlertCircle, TrendingUp } from 'lucide-react';
import { apiCall } from '../lib/api';

interface Insight {
  title: string;
  description: string;
  icon: string;
  tag: string;
  color: string;
}

interface Metrics {
  healthScore: number;
  savingsRatio: number;
  netWorthVelocity: string;
}

export default function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ healthScore: 0, savingsRatio: 0, netWorthVelocity: 'Idle' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'PieChart': return <PieChart className="text-blue-600" />;
      case 'Zap': return <Zap className="text-green-600" />;
      case 'Target': return <Target className="text-yellow-600" />;
      case 'TrendingDown': return <TrendingDown className="text-red-600" />;
      case 'AlertCircle': return <AlertCircle className="text-red-600" />;
      case 'TrendingUp': return <TrendingUp className="text-blue-600" />;
      default: return <Sparkles className="text-blue-600" />;
    }
  };

  useEffect(() => {
    const fetchAIAnalysis = async () => {
      setLoading(true);
      try {
        const data = await apiCall('/expense/ai-analysis');
        if (data && data.insights) {
          setInsights(data.insights);
          setMetrics(data.metrics || { healthScore: 0, savingsRatio: 0, netWorthVelocity: 'Healthy' });
          setError(null);
        }
      } catch (err: any) {
        console.error("Failed to fetch AI analysis:", err);
        setError(err.message || "Something went wrong fetching insights");
      } finally {
        setLoading(false);
      }
    };

    fetchAIAnalysis();
  }, []);

  return (
    <div className="w-full max-w-6xl p-4 sm:p-6 lg:p-8 transition-all duration-300">
      {/* Header section with AI feel */}
      <div className="relative overflow-hidden bg-black rounded-[2.5rem] p-8 sm:p-12 mb-10 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/10">
              <Sparkles size={16} className="text-blue-400 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-blue-100">Live Gemini Financial Audit</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tighter leading-tight">
              AI Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Financial Insights</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl font-medium">
              We've analyzed your transaction history using Gemini to provide personalized recommendations.
            </p>
          </div>
          <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <Brain size={120} strokeWidth={1} className={`text-white/20 absolute ${loading ? 'animate-pulse' : ''}`} />
            <Sparkles size={40} className="text-blue-400 animate-bounce delay-700" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
            <div className="inline-block w-12 h-12 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-bold tracking-widest uppercase text-xs">Consulting Gemini...</p>
        </div>
      ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="text-blue-600" />
                    </div>
                    <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Financial Health</h3>
                    <p className="text-2xl font-black text-gray-900">{metrics.healthScore}%</p>
                    <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${metrics.healthScore}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <PieChart className="text-purple-600" />
                    </div>
                    <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Savings Rate</h3>
                    <p className="text-2xl font-black text-gray-900">{metrics.savingsRatio}%</p>
                    <div className="mt-4 flex items-center gap-2 text-green-500 text-xs font-bold">
                        <TrendingUp size={14} /> <span>Live data</span>
                    </div>
                </div>
                
                <div className="md:col-span-2 bg-gradient-to-r from-yellow-700 to-yellow-600 p-6 rounded-3xl shadow-xl shadow-yellow-100/50 text-white flex justify-between items-center group">
                    <div>
                        <h3 className="text-yellow-100 text-[10px] font-black uppercase tracking-widest mb-1">Net Worth Velocity</h3>
                        <p className="text-3xl font-black italic">{metrics.netWorthVelocity}</p>
                        <p className="text-yellow-50/70 text-sm mt-2 font-medium">Wealth creation is currently in a "{metrics.netWorthVelocity.toLowerCase()}" phase.</p>
                    </div>
                    <Zap size={64} className="text-yellow-400/30 group-hover:scale-110 transition-all duration-500" />
                </div>
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-8 px-2">Personalized Gemini Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {error ? (
                    <div className="col-span-2 py-20 text-center bg-red-50 rounded-[3rem] border-2 border-dashed border-red-100">
                      <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                      <h4 className="text-lg font-bold text-red-900">Analysis Unavailable</h4>
                      <p className="text-red-600 text-sm">{error}</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-red-600 text-white font-bold rounded-full text-sm"
                      >
                        Try Refreshing
                      </button>
                    </div>
                ) : insights.length > 0 ? insights.map((insight, index) => (
                    <div 
                        key={index} 
                        className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col sm:flex-row gap-6"
                    >
                    <div className={`w-16 h-16 shrink-0 ${insight.color} rounded-3xl flex items-center justify-center text-2xl shadow-inner group-hover:rotate-12 transition-transform duration-500 transition-colors`}>
                        {getIcon(insight.icon)}
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-wider">
                                {insight.tag}
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-gray-900">{insight.title}</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            {insight.description}
                        </p>
                        <button className="mt-4 text-sm font-black text-blue-600 hover:text-blue-700 flex items-center gap-2 group/btn">
                            Explore Strategy <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                    </div>
                )) : (
                    <div className="col-span-2 py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                        <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
                        <h4 className="text-lg font-bold text-gray-400">Insufficient Data</h4>
                        <p className="text-gray-400 text-sm">Gemini needs at least a few transactions to perform a deep analysis.</p>
                    </div>
                )}
            </div>
        </>
      )}

      {/* Footer Decoration */}
      <div className="mt-20 p-10 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[3rem] text-center">
         <Sparkles className="mx-auto text-gray-300 mb-4" size={48} strokeWidth={1} />
         <h4 className="text-lg font-bold text-gray-400">Continuous AI Learning</h4>
         <p className="text-gray-400 text-sm max-w-xs mx-auto mt-2">The more you track, the more accurate Gemini's predictions become.</p>
      </div>
    </div>
  );
}
