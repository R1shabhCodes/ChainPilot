'use client';

import React, { useState, useEffect } from 'react';
import { calculateRangeGeometry } from '@/lib/decision/rangeGeometry';

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
  // Local UI state for interactive tick drift simulator initialized to real currentTick
  const [simulatedTick, setSimulatedTick] = useState<number | null>(currentTick);

  // Sync simulatedTick when real currentTick prop changes (e.g. position navigation)
  useEffect(() => {
    setSimulatedTick(currentTick);
  }, [currentTick]);

  // Fallback if ticks are missing or invalid
  if (tickLower === null || tickUpper === null || currentTick === null) {
    return (
      <div className="p-4 bg-[var(--cp-surface)] border t-border font-mono text-xs t-text-muted flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-[var(--cp-border)]"></span>
          TICK TELEMETRY
        </span>
        <span>Verified subgraph tick payload incomplete</span>
      </div>
    );
  }

  const lower = Math.min(tickLower, tickUpper);
  const upper = Math.max(tickLower, tickUpper);
  const realCurr = currentTick;
  const curr = simulatedTick ?? realCurr;
  const isSimulating = simulatedTick !== null && simulatedTick !== realCurr;

  // Use pure deterministic range geometry calculator
  const geometry = calculateRangeGeometry(lower, upper, curr);
  const isInRange = geometry ? geometry.isInRange : (curr >= lower && curr <= upper);
  const isBelow = geometry ? geometry.isBelow : (curr < lower);
  const isAbove = geometry ? geometry.isAbove : (curr > upper);

  // Range span math for slider & spectrum calculation
  const tickSpan = Math.max(upper - lower, 100);
  const sliderMin = Math.round(Math.min(lower - tickSpan * 0.6, realCurr - tickSpan * 0.2));
  const sliderMax = Math.round(Math.max(upper + tickSpan * 0.6, realCurr + tickSpan * 0.2));
  const sliderStep = Math.max(1, Math.floor((sliderMax - sliderMin) / 500));

  // Calculated distance metrics
  let distanceText = '';
  if (isBelow) {
    const dist = lower - curr;
    distanceText = `${dist.toLocaleString('en-US')} ticks below lower boundary`;
  } else if (isAbove) {
    const dist = curr - upper;
    distanceText = `${dist.toLocaleString('en-US')} ticks above upper boundary`;
  } else {
    const distLower = curr - lower;
    const distUpper = upper - curr;
    distanceText = `+${distLower.toLocaleString('en-US')} from lower / -${distUpper.toLocaleString('en-US')} to upper`;
  }

  // Visual Spectrum Math
  let minVal: number;
  let maxVal: number;

  if (isInRange) {
    const margin = tickSpan * 0.2;
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
  let statusBadgeLabel = isInRange
    ? 'IN RANGE [ACTIVE]'
    : isBelow
    ? 'OUT OF RANGE [BELOW ACTIVE BOUNDS]'
    : 'OUT OF RANGE [ABOVE ACTIVE BOUNDS]';

  if (isSimulating) {
    statusBadgeLabel = isInRange ? 'SIMULATED: IN RANGE' : 'SIMULATED: OUT OF RANGE';
  }

  let badgeColorClass = isInRange
    ? 'bg-[#baf24a] text-[#020306]'
    : 'bg-red-500 text-white';
  let indicatorColorClass = isInRange
    ? 'bg-[#baf24a] text-[#020306] border-[#baf24a]'
    : 'bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
  let rangeBoxClass = isInRange
    ? 'bg-[#baf24a]/20 border-[#baf24a]/80'
    : 'bg-[#141a29]/50 border-[#1e283d]';

  if (isSimulating) {
    badgeColorClass = isInRange
      ? 'bg-amber-400 text-black font-black'
      : 'bg-red-600 text-white font-black';
  }

  return (
    <div className="w-full bg-[var(--cp-surface)] border t-border p-4 md:p-5 font-mono flex flex-col gap-5 text-xs select-none relative overflow-hidden">
      {/* Background Architectural Watermark */}
      <div className="absolute right-0 top-0 opacity-5 pointer-events-none text-9xl font-black -mt-6 -mr-4 text-cyan-500">
        CP
      </div>

      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b t-border pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 ${isInRange ? 'bg-[#baf24a]' : 'bg-red-500'} ${isSimulating ? 'bg-amber-400 animate-ping' : 'animate-pulse'}`}></span>
          <span className="text-[11px] font-black tracking-widest t-text uppercase">
            LIQUIDITY TICK RANGE INSTRUMENT
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isSimulating && (
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-amber-500/10 border border-amber-500/40 text-amber-500 animate-pulse">
              SIMULATED
            </span>
          )}
          <span className={`px-2 py-0.5 text-[10px] font-black uppercase ${badgeColorClass}`}>
            {statusBadgeLabel}
          </span>
        </div>
      </div>

      {/* Spectrum Instrument Bar */}
      <div className="relative pt-10 pb-8 px-2 z-10">
        {/* Floating Current Tick Needle Tag */}
        <div
          className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center z-30 transition-all duration-300 ease-out"
          style={{ left: `${pctCurrent}%` }}
        >
          <span className={`px-2 py-1 text-[10px] font-black tracking-widest border flex items-center gap-1 uppercase ${indicatorColorClass}`}>
            {isBelow && '◀ '}
            {isInRange && '● '}
            {isAbove && '▶ '}
            {isSimulating ? 'SIMULATED' : 'LIVE'}: {curr.toLocaleString('en-US')}
          </span>
          <div className={`w-0.5 h-4 ${isInRange ? 'bg-[#baf24a]' : 'bg-red-500'}`}></div>
        </div>

        {/* Track Line Axis */}
        <div className="w-full h-4 bg-[var(--cp-surface-elevated)] border t-border relative overflow-hidden">
          {/* Grid Tick Hash Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--cp-border)_1px,transparent_1px)] bg-[size:5%_100%] opacity-60"></div>

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
        <div className="relative mt-3 text-[10px] t-text-muted flex justify-between font-mono font-bold tracking-widest uppercase">
          <div
            className="absolute transform -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${pctLower}%` }}
          >
            <div className="w-px h-2 bg-[var(--cp-border-strong)] mb-1"></div>
            <span className="t-text-secondary">{lower.toLocaleString('en-US')}</span>
            <span className="text-[8px] mt-0.5">LOWER</span>
          </div>

          <div
            className="absolute transform -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${pctUpper}%` }}
          >
            <div className="w-px h-2 bg-[var(--cp-border-strong)] mb-1"></div>
            <span className="t-text-secondary">{upper.toLocaleString('en-US')}</span>
            <span className="text-[8px] mt-0.5">UPPER</span>
          </div>
        </div>
      </div>

      {/* Numerical Telemetry Data Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border t-border text-[10px] z-10 relative">
        <div className="p-3 bg-[var(--cp-surface-elevated)] border-b sm:border-b-0 sm:border-r t-border flex flex-col items-center justify-center text-center">
          <span className="t-text-muted uppercase font-black tracking-widest mb-1">Lower Bound</span>
          <span className="font-bold t-text text-sm">{lower.toLocaleString('en-US')}</span>
        </div>
        <div className={`p-3 border-b sm:border-b-0 sm:border-r flex flex-col items-center justify-center text-center ${isInRange ? 'bg-[var(--cp-surface-highlight)] t-border' : 'bg-red-500/10 border-red-500/30'}`}>
          <span className="t-text-muted uppercase font-black tracking-widest mb-1">
            {isSimulating ? 'SIMULATED TICK' : 'LIVE POOL TICK'}
          </span>
          <span className={`font-bold text-sm ${isInRange ? 'text-[#baf24a]' : 'text-red-400'}`}>
            {curr.toLocaleString('en-US')}
          </span>
          {isSimulating && (
            <span className="text-[9px] t-text-muted mt-0.5">
              Live: {realCurr.toLocaleString('en-US')}
            </span>
          )}
        </div>
        <div className="p-3 bg-[var(--cp-surface-elevated)] flex flex-col items-center justify-center text-center">
          <span className="t-text-muted uppercase font-black tracking-widest mb-1">Upper Bound</span>
          <span className="font-bold t-text text-sm">{upper.toLocaleString('en-US')}</span>
        </div>
      </div>

      {/* SIMULATION CONTROLS PANEL — NOT LIVE DATA */}
      <div className="mt-2 border t-border bg-[var(--cp-surface-elevated)] p-4 relative z-10 flex flex-col gap-3">
        {/* Simulation Header Label */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b t-border pb-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-500 border border-amber-500/40">
              SIMULATION — NOT LIVE DATA
            </span>
            <span className="text-[10px] t-text-muted font-mono hidden sm:inline">
              Interactive Tick Drift Simulator
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold t-text-secondary">
            Distance: <span className="t-text font-black">{distanceText}</span>
          </span>
        </div>

        {/* Slider input */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px] font-mono t-text-muted font-bold">
            <span className="flex items-center gap-1.5">
              <span>LIVE CURRENT TICK:</span>
              <span className="t-text font-black">{realCurr.toLocaleString('en-US')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span>SIMULATED CURRENT TICK:</span>
              <span className={`font-black ${isSimulating ? 'text-amber-500' : 't-text'}`}>
                {curr.toLocaleString('en-US')}
              </span>
            </span>
          </div>

          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={sliderStep}
            value={curr}
            onChange={(e) => setSimulatedTick(Number(e.target.value))}
            className="w-full h-2 bg-[var(--cp-surface)] border t-border rounded-none appearance-none cursor-pointer accent-amber-500 focus:outline-none"
            aria-label="Simulated Current Tick Slider"
          />

          <div className="flex justify-between text-[9px] font-mono t-text-muted">
            <span>Min: {sliderMin.toLocaleString('en-US')}</span>
            <span>Range: {lower.toLocaleString('en-US')} → {upper.toLocaleString('en-US')}</span>
            <span>Max: {sliderMax.toLocaleString('en-US')}</span>
          </div>
        </div>

        {/* Quick Scenario Preset Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSimulatedTick(Math.round(lower - tickSpan * 0.15))}
              className="px-2 py-1 text-[9px] font-mono font-bold uppercase border t-border bg-[var(--cp-surface)] hover:border-red-500/50 hover:text-red-400 t-text-secondary transition-colors"
            >
              ◀ Below Range
            </button>
            <button
              type="button"
              onClick={() => setSimulatedTick(Math.round((lower + upper) / 2))}
              className="px-2 py-1 text-[9px] font-mono font-bold uppercase border t-border bg-[var(--cp-surface)] hover:border-[#baf24a]/50 hover:text-[#baf24a] t-text-secondary transition-colors"
            >
              ● Mid-Range
            </button>
            <button
              type="button"
              onClick={() => setSimulatedTick(Math.round(upper + tickSpan * 0.15))}
              className="px-2 py-1 text-[9px] font-mono font-bold uppercase border t-border bg-[var(--cp-surface)] hover:border-red-500/50 hover:text-red-400 t-text-secondary transition-colors"
            >
              Above Range ▶
            </button>
          </div>

          {isSimulating && (
            <button
              type="button"
              onClick={() => setSimulatedTick(realCurr)}
              className="px-2 py-1 text-[9px] font-mono font-black uppercase border border-amber-500/40 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors"
            >
              Reset to Live Tick
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
