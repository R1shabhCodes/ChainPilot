'use client';

import React from 'react';
import {
  PortfolioAnalysisResponse,
  PositionRiskSummary,
  RiskLevel,
  SuggestedAction,
} from '@/lib/ai/types';
import LiquidityRangeVisualizer from './LiquidityRangeVisualizer';

export interface AnalyzeStatusNotice {
  status: string;
  code: string;
  message: string;
  canAnalyze: boolean;
}

export interface AIRiskCardProps {
  analysis: PortfolioAnalysisResponse | null;
  loading: boolean;
  statusNotice?: AnalyzeStatusNotice | null;
  error?: string | null;
  focusedPositionId?: string | null;
  onRetry?: () => void;
  onSelectAction?: (action: SuggestedAction, position: PositionRiskSummary) => void;
}

function getRiskBadgeStyle(level: RiskLevel): string {
  switch (level) {
    case 'LOW':
      return 'bg-[#baf24a] text-[#020306] border-[#baf24a]';
    case 'MODERATE':
      return 'bg-amber-400 text-[#020306] border-amber-400';
    case 'HIGH':
      return 'bg-orange-500 text-white border-orange-500';
    case 'CRITICAL':
      return 'bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
    default:
      return 'bg-slate-700 text-slate-200 border-slate-600';
  }
}

/**
 * Extracts numeric tick lower, tick upper, and current pool tick values
 * from direct position properties or from verified evidence citations.
 */
function extractTicks(pos: PositionRiskSummary) {
  let tickLower: number | null = pos.tickLower ?? null;
  let tickUpper: number | null = pos.tickUpper ?? null;
  let currentTick: number | null = pos.currentTick ?? null;

  if (pos.evidence && pos.evidence.length > 0) {
    for (const ev of pos.evidence) {
      const field = ev.field?.toLowerCase() || '';
      const valStr = ev.value || '';

      if (currentTick === null && (field.includes('current') || field.includes('pool tick'))) {
        const num = parseInt(valStr.replace(/[^0-9-]/g, ''), 10);
        if (!isNaN(num)) currentTick = num;
      }

      if (tickLower === null || tickUpper === null) {
        if (field.includes('boundary') || field.includes('boundaries') || field.includes('range') || field.includes('tick')) {
          const lowerMatch = valStr.match(/Lower:\s*(-?\d+)/i) || valStr.match(/Lower\s*(-?\d+)/i);
          const upperMatch = valStr.match(/Upper:\s*(-?\d+)/i) || valStr.match(/Upper\s*(-?\d+)/i);
          if (lowerMatch && tickLower === null) {
            tickLower = parseInt(lowerMatch[1], 10);
          }
          if (upperMatch && tickUpper === null) {
            tickUpper = parseInt(upperMatch[1], 10);
          }
        }
        if (field.includes('lower')) {
          const num = parseInt(valStr.replace(/[^0-9-]/g, ''), 10);
          if (!isNaN(num)) tickLower = num;
        }
        if (field.includes('upper')) {
          const num = parseInt(valStr.replace(/[^0-9-]/g, ''), 10);
          if (!isNaN(num)) tickUpper = num;
        }
      }
    }
  }

  return { tickLower, tickUpper, currentTick };
}

export default function AIRiskCard({
  analysis,
  loading,
  statusNotice,
  error,
  focusedPositionId,
  onRetry,
  onSelectAction,
}: AIRiskCardProps) {
  // Loading State
  if (loading) {
    return (
      <div className="w-full panel-architecture p-8 min-h-[400px] flex flex-col items-center justify-center gap-6 animate-fadeIn">
        <div className="h-10 w-10 border-t-2 border-r-2 border-[#00F0FF] animate-spin"></div>
        <div className="flex flex-col items-center gap-2 font-mono">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#00F0FF]">
            PROCESSING SUBGRAPH TELEMETRY
          </h3>
          <span className="text-xs text-slate-500">Executing Gemini AI Reasoning Engine...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full panel-architecture border-red-500/50 p-8 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
          <span className="text-xs font-black text-red-500 uppercase tracking-widest">
            ANALYSIS PIPELINE FAULT
          </span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-slate-300 hover:text-white font-black uppercase tracking-widest border border-slate-700 px-3 py-1"
            >
              [ RETRY ]
            </button>
          )}
        </div>
        <p className="text-sm font-mono text-slate-300">{error}</p>
      </div>
    );
  }

  // Status Notice State
  if (statusNotice && !statusNotice.canAnalyze) {
    return (
      <div className="w-full panel-architecture border-cyan-900/60 p-8 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-cyan-500"></span>
            <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400">
              SYSTEM STATUS NOTICE
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#020306] text-cyan-500 font-bold border border-cyan-900">
            {statusNotice.code}
          </span>
        </div>
        <p className="font-mono text-sm text-slate-300">{statusNotice.message}</p>
      </div>
    );
  }

  if (!analysis || !analysis.positionSummaries || analysis.positionSummaries.length === 0) {
    return null;
  }

  // Determine which position to show in the dominant view
  const pos = focusedPositionId 
    ? analysis.positionSummaries.find(p => p.positionId === focusedPositionId) 
    : analysis.positionSummaries[0];

  if (!pos) {
    return (
      <div className="w-full panel-architecture p-8 flex items-center justify-center text-slate-500 font-mono text-xs">
        Position details unavailable.
      </div>
    );
  }

  const { tickLower, tickUpper, currentTick } = extractTicks(pos);

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn">
      {/* DOMINANT POSITION HEADER */}
      <div className="w-full panel-architecture bg-[#06080d] p-6 flex flex-col gap-4 border-t-2 border-t-[#00F0FF] shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#141a29] pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="font-display font-black text-3xl text-white tracking-tighter uppercase">
                {pos.tokenPair}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 font-mono">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest bg-[#020306] border border-[#141a29] px-2 py-1">
                {pos.protocol}
              </span>
              <span className="text-[10px] text-slate-500 font-bold">
                POSITION NFT #{pos.positionId}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 font-mono">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">AI Risk Assessment</span>
            <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest ${getRiskBadgeStyle(pos.riskLevel)}`}>
              {pos.riskLevel} RISK
            </span>
          </div>
        </div>

        {/* LIQUIDITY RANGE VISUALIZER (MASSIVE FOCAL POINT) */}
        <div className="w-full pt-2">
          <LiquidityRangeVisualizer
            tickLower={tickLower}
            tickUpper={tickUpper}
            currentTick={currentTick}
            rangeStatus={pos.rangeStatus}
          />
        </div>
      </div>

      {/* TWO DISTINCT PANELS: VERIFIED DATA vs AI INTERPRETATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PANEL 1: VERIFIED ON-CHAIN DATA */}
        <div className="panel-architecture bg-[#020306] p-5 flex flex-col gap-4 border-t border-t-cyan-500/50">
          <div className="flex items-center justify-between border-b border-[#141a29] pb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-cyan-400"></span>
              VERIFIED ON-CHAIN DATA
            </span>
            <span className="text-[8px] text-cyan-500/50 uppercase tracking-widest">
              DETERMINISTIC SUBGRAPH TELEMETRY
            </span>
          </div>

          {pos.evidence && pos.evidence.length > 0 ? (
            <div className="flex flex-col gap-2">
              {pos.evidence.map((ev, idx) => (
                <div key={idx} className="flex flex-col border-b border-[#141a29] pb-2 last:border-0 last:pb-0 font-mono">
                  <span className="text-[9px] uppercase tracking-widest text-slate-500">{ev.field}</span>
                  <span className="text-xs font-bold text-slate-200 mt-0.5">{ev.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-mono italic">No raw telemetry cited.</p>
          )}
        </div>

        {/* PANEL 2: AI RISK INTERPRETATION */}
        <div className="panel-architecture bg-[#06080d] p-5 flex flex-col gap-4 border-t border-t-[#d075ff]/50">
          <div className="flex items-center justify-between border-b border-[#141a29] pb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#d075ff] flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-[#d075ff]"></span>
              AI RISK INTERPRETATION
            </span>
            <span className="text-[8px] text-[#d075ff]/50 uppercase tracking-widest">
              GEMINI REASONING EVALUATION
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">
            {pos.summary}
          </p>

          {/* Suggested Action Trigger */}
          {pos.suggestedAction && (
            <div className="mt-auto pt-4 border-t border-[#141a29] flex flex-col gap-3 font-mono">
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold text-[11px] text-[#baf24a]">
                  ACTION: {pos.suggestedAction.title}
                </span>
                <span className="text-[8px] px-1.5 py-0.5 bg-[#020306] border border-[#141a29] text-slate-400">
                  {pos.suggestedAction.actionType}
                </span>
              </div>
              
              {onSelectAction && (
                <button
                  onClick={() => onSelectAction(pos.suggestedAction!, pos)}
                  className="w-full bg-[#00F0FF] hover:bg-cyan-300 text-[#020306] font-black text-[10px] uppercase tracking-widest py-3 px-4 transition-colors text-center"
                >
                  REVIEW ACTION PROPOSAL
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
