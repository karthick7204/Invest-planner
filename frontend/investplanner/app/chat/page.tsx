'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Trash2,
  Bot,
  User,
  Copy,
  Check,
  TrendingUp,
  Wallet,
  ShieldCheck,
  ArrowDownCircle,
  HelpCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { apiCall } from '../lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface FinancialMetricsSnapshot {
  totalIncome?: number;
  totalExpenses?: number;
  netSurplus?: number;
  healthScore?: number;
  savingsRatio?: number;
}

const SUGGESTED_PROMPTS = [
  'How much can I safely invest this month?',
  'What were my top expense categories?',
  'Can I afford a ₹30,000 expense right now?',
  'How should I split my surplus into Stocks, Mutual Funds & Gold?',
  'Give me 3 realistic steps to cut monthly expenses.',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '👋 Hello! I am your **Invest Planner AI Copilot**.\n\nI have real-time access to your income, expenses, budgets, and savings goals. Ask me anything about your finances, affordability, or investment split!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<FinancialMetricsSnapshot | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load chat history from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('spendly_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // Ignore localStorage parse errors
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem('spendly_chat_history', JSON.stringify(messages.slice(-30)));
      }
    } catch {
      // Ignore
    }
  }, [messages]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    const welcomeMsg: Message = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content:
        '👋 Chat cleared. I am ready with your latest financial data. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcomeMsg]);
    localStorage.removeItem('spendly_chat_history');
    setError(null);
  };

  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setError(null);
    const userMsgId = `user-${Date.now()}`;
    const newTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage: Message = {
      id: userMsgId,
      role: 'user',
      content: query,
      timestamp: newTimestamp,
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history (excluding the very first welcome prompt if wanted, but keep dialog clean)
      const historyPayload = updatedMessages
        .filter((m) => m.id !== 'welcome' && !m.id.startsWith('welcome-'))
        .slice(-10)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await apiCall('ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      if (res.metrics) {
        setMetrics(res.metrics);
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: res.reply || 'I analyzed your finances, but could not formulate a response.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to connect to AI advisor. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Simple formatter for assistant markdown-like output (bolding, lists, linebreaks)
  const formatContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Check if line is a bullet
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      const cleanLine = isBullet ? line.trim().substring(2) : line;

      // Handle bold formatting (**text**)
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-neutral-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={index} className="ml-4 list-disc text-neutral-800 my-1 leading-relaxed">
            {renderedParts}
          </li>
        );
      }

      if (!line.trim()) {
        return <div key={index} className="h-2" />;
      }

      return (
        <p key={index} className="my-1 leading-relaxed text-neutral-800">
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-5xl mx-auto w-full">
      {/* Header bar */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm p-4 mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center shadow-sm">
            <Sparkles size={18} className="text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-neutral-950">AI Financial Copilot</h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Context
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Ask personalized questions about your budget, surplus, and investments
            </p>
          </div>
        </div>

        {/* Snapshot Quick Stats & Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {metrics && (
            <div className="hidden sm:flex items-center gap-2 bg-neutral-50 border border-neutral-200/60 rounded-xl px-3 py-1.5 text-xs text-neutral-700">
              <span>Surplus: <strong className="text-neutral-900">₹{(metrics.netSurplus ?? 0).toLocaleString()}</strong></span>
              <span className="text-neutral-300">|</span>
              <span>Health: <strong className="text-neutral-900">{metrics.healthScore ?? 0}/100</strong></span>
            </div>
          )}
          <button
            onClick={handleClearChat}
            title="Clear conversation"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-950 bg-neutral-100/80 hover:bg-neutral-100 rounded-xl transition cursor-pointer"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Scroll Area */}
      <div className="flex-1 bg-white rounded-2xl border border-neutral-200/90 shadow-sm p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-semibold shadow-xs ${
                  isUser
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 border border-neutral-200 text-neutral-800'
                }`}
              >
                {isUser ? <User size={16} /> : <Bot size={16} className="text-neutral-800" />}
              </div>

              {/* Message Content Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`relative group rounded-2xl px-4 py-3 text-sm shadow-xs ${
                    isUser
                      ? 'bg-neutral-950 text-white rounded-tr-xs'
                      : 'bg-neutral-50/80 border border-neutral-200/80 text-neutral-900 rounded-tl-xs'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  ) : (
                    <div>{formatContent(message.content)}</div>
                  )}

                  {/* Copy Button for Assistant responses */}
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(message.id, message.content)}
                      className="absolute top-2 right-2 p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === message.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    </button>
                  )}
                </div>

                <span className="text-[10px] text-neutral-400 mt-1 px-1">{message.timestamp}</span>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl rounded-tl-xs px-4 py-3 text-sm flex items-center gap-2 text-neutral-500 shadow-xs">
              <Loader2 size={16} className="animate-spin text-neutral-700" />
              <span>Analyzing your financial data...</span>
            </div>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => sendMessage()}
              className="text-xs font-semibold text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2">
        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <HelpCircle size={12} /> Ideas:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => sendMessage(prompt)}
            className="text-xs bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80 px-3 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer disabled:opacity-50 shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm p-2 flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your spending, budget, or investments..."
          disabled={isLoading}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
        />
        <button
          onClick={() => sendMessage()}
          disabled={isLoading || !input.trim()}
          className="bg-neutral-950 text-white p-2.5 rounded-xl hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-neutral-950 transition cursor-pointer shrink-0"
          title="Send message"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}
