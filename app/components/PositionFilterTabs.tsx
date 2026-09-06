'use client';

export type PositionFilter = 'ALL' | 'IN_RANGE' | 'OUT_OF_RANGE' | 'CRITICAL_RISK';

interface PositionFilterTabsProps {
  activeFilter: PositionFilter;
  onFilterChange: (filter: PositionFilter) => void;
  counts?: {
    all?: number;
    inRange?: number;
    outOfRange?: number;
    criticalRisk?: number;
  };
}

export default function PositionFilterTabs({
  activeFilter,
  onFilterChange,
  counts,
}: PositionFilterTabsProps) {
  const tabs: { key: PositionFilter; label: string; count?: number }[] = [
    { key: 'ALL', label: 'All Positions', count: counts?.all },
    { key: 'IN_RANGE', label: 'In-Range', count: counts?.inRange },
    { key: 'OUT_OF_RANGE', label: 'Out-of-Range', count: counts?.outOfRange },
    { key: 'CRITICAL_RISK', label: 'Critical Risk', count: counts?.criticalRisk },
  ];

  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeFilter === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onFilterChange(tab.key)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap ${
              isActive
                ? 'bg-slate-800 text-cyan-300 border-cyan-500/60 shadow-sm shadow-cyan-500/10'
                : 'glass-panel bg-slate-900/40 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
