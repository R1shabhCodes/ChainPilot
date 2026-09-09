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
            className={`px-4 py-2.5 text-xs font-mono font-bold rounded border transition-all flex items-center gap-2.5 whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-[var(--bg-surface-elevated)] text-[var(--accent-purple)] border-[var(--accent-purple)] shadow-sm shadow-[var(--accent-purple-glow)]'
                : 'panel-sharp bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-primary)] hover:border-[var(--border-color-hover)]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  isActive
                    ? 'bg-[var(--accent-purple-glow)] text-[var(--accent-purple)] border border-[var(--accent-purple)]'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border border-[var(--border-color)]'
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
