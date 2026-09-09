'use client';

import React from 'react';

export interface LiquidityRangeVisualizerProps {
  tickLower: number | null;
  tickUpper: number | null;
  currentTick: number | null;
  rangeStatus: 'IN_RANGE' | 'OUT_OF_RANGE' | 'UNKNOWN';
}

export default function LiquidityRangeVisualizer({
  tickLower,
  tickUpper,
  currentTick,
  rangeStatus,
}: LiquidityRangeVisualizerProps) {
  // Fallback if ticks are missing or invalid
  if (tickLower === null || tickUpper === null || currentTick === null) {
    return (
      <div className="p-3 bg-[#07090e] border border-slate-800 font-mono text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-2 text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
          TICK TELEMETRY
        </span>
        <span className="text-slate-400">Verified subgraph tick payload incomplete</span>
      </div>
    );
  }

  const lower = Math.min(tickLower, tickUpper);
  const upper = Math.max(tickLower, tickUpper);
  const curr = currentTick;

  const isInRange = curr >= lower && curr <= upper;
  const isBelow = curr < lower;
  const isAbove = curr > upper;

  // Visual Spectrum Math
  let minVal: number;
  let maxVal: number;

  if (isInRange) {
    const span = Math.max(upper - lower, 100);
    const margin = span * 0.2;
    minVal = lower - margin;
    maxVal = upper + margin;
  } else if (isBelow) {
    const span = Math.max(upper - curr, 100);
    const margin = span * 0.12;
    minVal = curr - margin;
    maxVal = upper + margin;
  } else {
    // isAbove
    const span = Math.max(curr - lower, 100);
    const margin = span * 0.12;
    minVal = lower - margin;
    maxVal = curr + margin;
  }

  const rangeSpan = Math.max(maxVal - minVal, 1);

  const calcPct = (val: number) => {
    const raw = ((val - minVal) / rangeSpan) * 100;
    return Math.min(Math.max(raw, 5), 95);
  };

  const pctLower = calcPct(lower);
  const pctUpper = calcPct(upper);
  const pctCurrent = calcPct(curr);
  const rangeWidth = Math.max(pctUpper - pctLower, 3);

  // Status Labels & Color Schemes
  let statusBadgeLabel = 'IN RANGE [ACTIVE]';
  let badgeColorClass = 'bg-[#BAF24A]/10 text-[#BAF24A] border-[#BAF24A]/40';
  let indicatorColorClass = 'bg-[#BAF24A] text-slate-950 border-[#BAF24A] shadow-[#BAF24A]/30';
  let rangeBoxClass = 'bg-[#BAF24A]/15 border-[#BAF24A]/50';

  if (isBelow) {
    statusBadgeLabel = 'OUT OF RANGE [BELOW ACTIVE BOUNDS]';
    badgeColorClass = 'bg-red-950/60 text-red-400 border-red-800/80';
    indicatorColorClass = 'bg-red-500 text-white border-red-400 shadow-red-500/30';
    rangeBoxClass = 'bg-amber-950/30 border-amber-700/50';
  } else if (isAbove) {
    statusBadgeLabel = 'OUT OF RANGE [ABOVE ACTIVE BOUNDS]';
    badgeColorClass = 'bg-red-950/60 text-red-400 border-red-800/80';
    indicatorColorClass = 'bg-red-500 text-white border-red-400 shadow-red-500/30';
    rangeBoxClass = 'bg-amber-950/30 border-amber-700/50';
  }

  return (
    <div className="w-full bg-[#07090e] border border-slate-800 p-4 font-mono flex flex-col gap-4 text-xs select-none">
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 ${isInRange ? 'bg-[#BAF24A]' : 'bg-red-500'} animate-pulse`}></span>
          <span className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">
            LIQUIDITY TICK RANGE INSTRUMENT
          </span>
        </div>
        <span className={`px-2 py-0.5 text-[10px] font-black uppercase border ${badgeColorClass}`}>
          {statusBadgeLabel}
        </span>
      </div>

      {/* Spectrum Instrument Bar */}
      <div className="relative pt-8 pb-8 px-2">
        {/* Floating Current Tick Needle Tag */}
        <div
          className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center z-20 transition-all duration-500"
          style={{ left: `${pctCurrent}%` }}
        >
          <span className={`px-2 py-0.5 text-[10px] font-black tracking-tight border shadow-lg flex items-center gap-1 ${indicatorColorClass}`}>
            {isBelow && '◀ '}
            {isInRange && '● '}
            {isAbove && '▶ '}
            CURRENT TICK: {curr.toLocaleString()}
          </span>
          <div className={`w-0.5 h-3 ${isInRange ? 'bg-[#BAF24A]' : 'bg-red-500'}`}></div>
        </div>

        {/* Track Line Axis */}
        <div className="w-full h-3.5 bg-slate-950 border border-slate-800 relative overflow-hidden">
          {/* Grid Tick Hash Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px)] bg-[size:8%_100%] opacity-40"></div>

          {/* Active Liquidity Zone Box */}
          <div
            className={`absolute top-0 bottom-0 border-x-2 transition-all duration-500 ${rangeBoxClass}`}
            style={{
              left: `${pctLower}%`,
              width: `${rangeWidth}%`,
            }}
          >
            {/* Range Strip Pattern Fill */}
            <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.04)_4px,rgba(255,255,255,0.04)_8px)]"></div>
          </div>

          {/* Current Tick Pin Marker */}
          <div
            className={`absolute top-0 bottom-0 w-1 transform -translate-x-1/2 z-10 ${isInRange ? 'bg-[#BAF24A]' : 'bg-red-500'}`}
            style={{ left: `${pctCurrent}%` }}
          ></div>
        </div>

        {/* Boundary Ticks Axis Labels */}
        <div className="relative mt-2 text-[10px] text-slate-400 flex justify-between font-mono">
          <div
            className="absolute transform -translate-x-1/2 flex flex-col items-center text-slate-300"
            style={{ left: `${pctLower}%` }}
          >
            <div className="w-0.5 h-1.5 bg-slate-600 mb-0.5"></div>
            <span className="font-bold text-slate-200">{lower.toLocaleString()}</span>
            <span className="text-[9px] text-slate-400 uppercase">Lower</span>
          </div>

          <div
            className="absolute transform -translate-x-1/2 flex flex-col items-center text-slate-300"
            style={{ left: `${pctUpper}%` }}
          >
            <div className="w-0.5 h-1.5 bg-slate-600 mb-0.5"></div>
            <span className="font-bold text-slate-200">{upper.toLocaleString()}</span>
            <span className="text-[9px] text-slate-400 uppercase">Upper</span>
          </div>
        </div>
      </div>

      {/* Numerical Telemetry Data Bar */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
        <div className="p-2 bg-slate-950 border border-slate-800 flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Tick Lower Boundary</span>
          <span className="font-bold text-slate-100 mt-0.5 font-mono">{lower.toLocaleString()}</span>
        </div>
        <div className={`p-2 border flex flex-col ${isInRange ? 'bg-slate-950 border-slate-800' : 'bg-red-950/20 border-red-900/40'}`}>
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Current Pool Tick</span>
          <span className={`font-bold mt-0.5 font-mono ${isInRange ? 'text-[#BAF24A]' : 'text-red-400'}`}>
            {curr.toLocaleString()}
          </span>
        </div>
        <div className="p-2 bg-slate-950 border border-slate-800 flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Tick Upper Boundary</span>
          <span className="font-bold text-slate-100 mt-0.5 font-mono">{upper.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
