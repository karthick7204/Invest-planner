'use client';

import { useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, TrendingUp, Settings, LogOut } from 'lucide-react';


export default function Sidebar(){  
    const router = useRouter();
    
    const handleNavigation = (page: string) => {
      router.push(`/${page}`);
    };

    return(
        <div className="w-52 h-screen border-r-2 bg-[#ffffff] border-gray-200 shadow-2xl p-4">
            <h2 className="text-xl font-bold mb-4"></h2> 
            <ul>
                <li className="mb-2 cursor-pointer flex flex-col">
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
                      className="cursor-pointer text-black flex items-center gap-3 w-full p-1 rounded hover:bg-gray-100 transition"
                    >
                        <FileText size={20} />
                        <span>Reports</span>
                    </button>
                </li>
                <li className="mb-2 cursor-pointer">
                    <button 
                      onClick={() => handleNavigation('stocksuggestions')} 
                      className="cursor-pointer text-black text-[15px] flex items-center gap-3 w-full p-1 rounded hover:bg-gray-100 transition"
                    >
                      <TrendingUp size={20} />
                      <span>Stock Suggestion</span>
                    </button>
                </li>
                <div className='absolute bottom-4 '>
                  <li className="mb-3 cursor-pointer">
                    <button 
                      onClick={() => handleNavigation('settings')} 
                      className="cursor-pointer text-black flex items-center gap-3 w-full p-1 rounded hover:bg-gray-100 transition"
                    >
                      <Settings size={20} />
                      <span>Settings</span>
                    </button>
                  </li>
                  <li className="mb-8 cursor-pointer">
                    <button 
                      onClick={() => router.push('/landingpage')} 
                      className="cursor-pointer text-red-600 flex items-center gap-3 w-full p-1 rounded hover:bg-gray-100 transition"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </li>
                </div>
            </ul>
        </div>
    )
}