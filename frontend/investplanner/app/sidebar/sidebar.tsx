'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, TrendingUp, Settings, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';

export default function Sidebar(){  
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    
    // Close sidebar on route change on mobile
    useEffect(() => {
      setIsOpen(false);
    }, [pathname]);

    const handleNavigation = (page: string) => {
      router.push(`/${page}`);
    };

    return(
        <div className="z-50">
            {/* Mobile Toggle Button - shows below header */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-[4.5rem] left-0 z-50 bg-white border border-gray-200 shadow-md rounded-r-lg p-2 focus:outline-none transition-transform duration-300 ease-in-out text-gray-600 hover:text-black"
                style={{ transform: isOpen ? 'translateX(16rem)' : 'translateX(0)' }}
            >
                {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>

            {/* Sidebar Overlay for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`fixed top-0 mt-12 lg:mt-0 lg:top-12 left-0 h-[calc(100vh-3rem)] lg:h-screen w-64 bg-[#ffffff] border-r-2 border-gray-200 shadow-xl p-4 z-40 transition-transform duration-300 ease-in-out overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <h2 className="text-xl font-bold mb-4"></h2> 
                <ul className="flex flex-col h-full">
                    <li className="mb-2 cursor-pointer flex flex-col mt-4">
                        <button 
                          onClick={() => handleNavigation('dashboard')} 
                          className="cursor-pointer text-black flex items-center gap-3 w-full p-2 rounded hover:bg-gray-100 transition"
                        >
                           <LayoutDashboard size={20} />
                          <span>Dashboard</span>
                        </button>
                    </li>
                    <li className="mb-2 cursor-pointer">
                        <button 
                          onClick={() => handleNavigation('reports')} 
                          className="cursor-pointer text-black flex items-center gap-3 w-full p-2 rounded hover:bg-gray-100 transition"
                        >
                            <FileText size={20} />
                            <span>Reports</span>
                        </button>
                    </li>
                    <li className="mb-2 cursor-pointer">
                        <button 
                          onClick={() => handleNavigation('stocksuggestions')} 
                          className="cursor-pointer text-black text-[15px] flex items-center gap-3 w-full p-2 rounded hover:bg-gray-100 transition"
                        >
                          <TrendingUp size={20} />
                          <span>Stock Suggestion</span>
                        </button>
                    </li>
                    
                    <div className="mt-auto pb-4">
                      <li className="mb-3 cursor-pointer">
                        <button 
                          onClick={() => handleNavigation('settings')} 
                          className="cursor-pointer text-black flex items-center gap-3 w-full p-2 rounded hover:bg-gray-100 transition"
                        >
                          <Settings size={20} />
                          <span>Settings</span>
                        </button>
                      </li>
                      <li className="mb-8 cursor-pointer">
                        <button 
                          onClick={() => router.push('/landingpage')} 
                          className="cursor-pointer text-red-600 flex items-center gap-3 w-full p-2 rounded hover:bg-red-50 transition"
                        >
                          <LogOut size={20} />
                          <span>Logout</span>
                        </button>
                      </li>
                    </div>
                </ul>
            </aside>
        </div>
    )
}