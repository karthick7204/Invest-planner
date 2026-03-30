'use client';

interface TimeLineProps {
    range: string;
    setRange: (range: string) => void;
}

export function TimeLine({ range, setRange }: TimeLineProps) {
    const tabs = ['Monthly', 'Quarterly', 'Yearly'];

    return(
           <div className="flex flex-1 bg-white rounded-lg gap-0">
             {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setRange(tab.toLowerCase())}
                className={`flex-1 py-3 px-4 font-semibold cursor-pointer transition  ${
                  range === tab.toLowerCase()
                    ? 'bg-yellow-400 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
             ))}
           </div>
    )
}