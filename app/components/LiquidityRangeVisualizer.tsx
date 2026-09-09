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
      <div className="p-4 bg-[#020306] border border-[#141a29] font-mono text-xs text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-[#141a29]"></span>
          TICK TELEMETRY
        </span>
        <span>Verified subgraph tick payload incomplete</span>
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
  let badgeColorClass = 'bg-[#baf24a] text-[#020306]';
  let indicatorColorClass = 'bg-[#baf24a] text-[#020306] border-[#baf24a]';
  let rangeBoxClass = 'bg-[#baf24a]/20 border-[#baf24a]/80';

  if (isBelow) {
    statusBadgeLabel = 'OUT OF RANGE [BELOW ACTIVE BOUNDS]';
    badgeColorClass = 'bg-red-500 text-white';
    indicatorColorClass = 'bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
    rangeBoxClass = 'bg-[#141a29]/50 border-[#1e283d]';
  } else if (isAbove) {
    statusBadgeLabel = 'OUT OF RANGE [ABOVE ACTIVE BOUNDS]';
    badgeColorClass = 'bg-red-500 text-white';
    indicatorColorClass = 'bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
    rangeBoxClass = 'bg-[#141a29]/50 border-[#1e283d]';
  }

  return (
    <div className="w-full bg-[#020306] border border-[#141a29] p-5 font-mono flex flex-col gap-6 text-xs select-none relative overflow-hidden">
      {/* Background Architectural Watermark */}
      <div className="absolute right-0 top-0 opacity-5 pointer-events-none text-9xl font-black -mt-6 -mr-4 text-cyan-500">
        CP
      </div>

      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#141a29] pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 ${isInRange ? 'bg-[#baf24a]' : 'bg-red-500'} animate-pulse`}></span>
          <span className="text-[11px] font-black tracking-widest text-slate-300 uppercase">
            LIQUIDITY TICK RANGE INSTRUMENT
          </span>
        </div>
        <span className={`px-2 py-0.5 text-[10px] font-black uppercase ${badgeColorClass}`}>
          {statusBadgeLabel}
        </span>
      </div>

      {/* Spectrum Instrument Bar */}
      <div className="relative pt-10 pb-8 px-2 z-10">
        
        {/* Floating Current Tick Needle Tag */}
        <div
          className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center z-30 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: `${pctCurrent}%` }}
        >
          <span className={`px-2 py-1 text-[10px] font-black tracking-widest border flex items-center gap-1 uppercase ${indicatorColorClass}`}>
            {isBelow && '◀ '}
            {isInRange && '● '}
            {isAbove && '▶ '}
            TICK: {curr.toLocaleString()}
          </span>
          <div className={`w-0.5 h-4 ${isInRange ? 'bg-[#baf24a]' : 'bg-red-500'}`}></div>
        </div>

        {/* Track Line Axis */}
        <div className="w-full h-4 bg-[#06080d] border border-[#141a29] relative overflow-hidden">
          {/* Grid Tick Hash Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e283d_1px,transparent_1px)] bg-[size:5%_100%] opacity-60"></div>

          {/* Active Liquidity Zone Box */}
          <div
            className={`absolute top-0 bottom-0 border-x-2 transition-all duration-500 ease-out ${rangeBoxClass}`}
            style={{
              left: `${pctLower}%`,
              width: `${rangeWidth}%`,
            }}
          >
            {/* Range Strip Pattern Fill */}
            <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.1)_4px,rgba(255,255,255,0.1)_8px)]"></div>
          </div>

          {/* Current Tick Pin Marker */}
          <div
            className={`absolute top-0 bottom-0 w-1.5 transform -translate-x-1/2 z-20 ${isInRange ? 'bg-[#baf24a] shadow-[0_0_10px_#baf24a]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`}
            style={{ left: `${pctCurrent}%` }}
          >
            {/* Radar Sweep Effect for Needle */}
            <div className="absolute inset-0 w-full h-full animate-pulse opacity-80 blur-[2px] bg-inherit"></div>
          </div>
        </div>

        {/* Boundary Ticks Axis Labels */}
        <div className="relative mt-3 text-[10px] text-slate-500 flex justify-between font-mono font-bold tracking-widest uppercase">
          <div
            className="absolute transform -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${pctLower}%` }}
          >
            <div className="w-px h-2 bg-[#1e283d] mb-1"></div>
            <span className="text-slate-300">{lower.toLocaleString()}</span>
            <span className="text-[8px] mt-0.5">LOWER</span>
          </div>

          <div
            className="absolute transform -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${pctUpper}%` }}
          >
            <div className="w-px h-2 bg-[#1e283d] mb-1"></div>
            <span className="text-slate-300">{upper.toLocaleString()}</span>
            <span className="text-[8px] mt-0.5">UPPER</span>
          </div>
        </div>
      </div>

      {/* Numerical Telemetry Data Bar */}
      <div className="grid grid-cols-3 gap-0 border border-[#141a29] text-[10px] mt-2 z-10 relative">
        <div className="p-3 bg-[#06080d] border-r border-[#141a29] flex flex-col items-center justify-center text-center">
          <span className="text-slate-500 uppercase font-black tracking-widest mb-1">Lower Bound</span>
          <span className="font-bold text-slate-200 text-sm">{lower.toLocaleString()}</span>
        </div>
        <div className={`p-3 border-r flex flex-col items-center justify-center text-center ${isInRange ? 'bg-[#0a0d14] border-[#141a29]' : 'bg-red-500/10 border-red-500/30'}`}>
          <span className="text-slate-500 uppercase font-black tracking-widest mb-1">Pool Tick</span>
          <span className={`font-bold text-sm ${isInRange ? 'text-[#baf24a]' : 'text-red-400'}`}>
            {curr.toLocaleString()}
          </span>
        </div>
        <div className="p-3 bg-[#06080d] flex flex-col items-center justify-center text-center">
          <span className="text-slate-500 uppercase font-black tracking-widest mb-1">Upper Bound</span>
          <span className="font-bold text-slate-200 text-sm">{upper.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
