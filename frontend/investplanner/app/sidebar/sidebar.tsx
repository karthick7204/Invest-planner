'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (page: string) => {
    setIsOpen(false);
    router.push(`/${page}`);
  };

  const navItems = [
    { label: 'Dashboard', path: 'Dashboard', icon: LayoutDashboard },
    { label: 'Reports', path: 'reports', icon: FileText },
    { label: 'AI Insights', path: 'ai-insights', icon: Sparkles },
    { label: 'Stock Suggestions', path: 'stocksuggestions', icon: TrendingUp },
  ];

  return (
    <div className="z-50">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-[4.5rem] left-0 z-50 bg-white border border-neutral-200 shadow-sm rounded-r-lg p-2 focus:outline-none transition-transform duration-300 ease-in-out text-neutral-600 hover:text-black"
        style={{ transform: isOpen ? 'translateX(16rem)' : 'translateX(0)' }}
      >
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Sidebar Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 mt-14 lg:mt-0 lg:top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-neutral-200/80 p-4 z-40 transition-transform duration-300 ease-in-out overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full justify-between pt-2">
          {/* Main Navigation Items */}
          <ul className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === `/${item.path}`;
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-neutral-950 text-white shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50'
                    }`}
                  >
                    <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Bottom Settings & Logout */}
          <div className="pb-4 pt-4 border-t border-neutral-100 flex flex-col gap-1">
            <button
              onClick={() => handleNavigation('settings')}
              className="flex items-center gap-3 w-full px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50 transition cursor-pointer"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                localStorage.removeItem('authToken');
                localStorage.removeItem('userId');
                router.push('/');
              }}
              className="flex items-center gap-3 w-full px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-500 hover:text-rose-600 hover:bg-rose-50/50 transition cursor-pointer"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}