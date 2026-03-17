'use client';

import { useState } from 'react';

export function TimeLine() {
    const [activeTab, setActiveTab] = useState('monthly');

    const tabs = ['Monthly', 'Quarterly', 'Yearly'];

    return(
           <div className="flex flex-1 bg-white rounded-lg gap-0">
             {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`flex-1 py-3 px-4 font-semibold cursor-pointer transition  ${
                  activeTab === tab.toLowerCase()
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
             ))}
           </div>
           
    )
}