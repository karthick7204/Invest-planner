'use client';

interface TimeLineProps {
  range: string;
  setRange: (range: string) => void;
}

export function TimeLine({ range, setRange }: TimeLineProps) {
  const tabs = ['Monthly', 'Quarterly', 'Yearly'];

  return (
    <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200/60 gap-1">
      {tabs.map((tab) => {
        const isActive = range === tab.toLowerCase();
        return (
          <button
            key={tab}
            onClick={() => setRange(tab.toLowerCase())}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono transition cursor-pointer ${
              isActive
                ? 'bg-black text-white shadow-sm font-medium'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}