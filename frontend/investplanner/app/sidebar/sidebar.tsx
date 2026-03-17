'use client';

import { useRouter } from 'next/navigation';

export default function Sidebar(){  
    const router = useRouter();
    
    const handleNavigation = (page: string) => {
      router.push(`/${page}`);
    };

    return(
        <div className="w-52 h-screen border-r-2 border-gray-300 p-4">
            <h2 className="text-xl font-bold mb-4"></h2> 
            <ul>
                <li className="mb-2 cursor-pointer">
                    <button 
                      onClick={() => handleNavigation('dashboard')} 
                      className="cursor-pointer"
                    >
                      Dashboard
                    </button>
                </li>
                <li className="mb-2 cursor-pointer">
                    <button 
                      onClick={() => handleNavigation('reports')} 
                      className="cursor-pointer"
                    >
                        Reports
                    </button>
                </li>
                <li className="mb-2 cursor-pointer">
                    <button 
                      onClick={() => handleNavigation('stocksuggestions')} 
                      className="cursor-pointer"
                    >
                      Stock Suggestions
                    </button>
                </li>
                <div className='absolute bottom-4 '>
                  <li className="mb-3 cursor-pointer">
                    <button 
                      onClick={() => handleNavigation('settings')} 
                      className="cursor-pointer hover:text-blue-500"
                    >
                      Settings
                    </button>
                  </li>
                  <li className="mb-8 cursor-pointer">
                    <button 
                      onClick={() => handleNavigation('logout')} 
                      className="cursor-pointer hover:text-blue-500"
                    >
                      Logout
                    </button>
                  </li>
                </div>
            </ul>
        </div>
    )
}