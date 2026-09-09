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
  onRetry?: () => void;
  onSelectAction?: (action: SuggestedAction, position: PositionRiskSummary) => void;
}

function getRiskBadgeColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW':
      return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
    case 'MODERATE':
      return 'bg-amber-950/80 text-amber-300 border-amber-800/80';
    case 'HIGH':
      return 'bg-orange-950/80 text-orange-400 border-orange-800/80';
    case 'CRITICAL':
      return 'bg-red-950/80 text-red-400 border-red-800/80';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700';
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
  onRetry,
  onSelectAction,
}: AIRiskCardProps) {
  // Loading State
  if (loading) {
    return (
      <div className="w-full bg-[#0a0d14] border border-slate-800 p-6 font-mono flex flex-col gap-4 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#00F0FF] animate-pulse"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              AI RISK REASONING ENGINE
            </h3>
          </div>
        </div>
        <div className="py-10 flex flex-col items-center justify-center gap-3 text-slate-400">
          <div className="h-7 w-7 border-2 border-[#00F0FF]/20 border-t-[#00F0FF] animate-spin"></div>
          <span className="text-xs font-medium tracking-wide">Evaluating On-Chain Data via Gemini AI...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full bg-[#0d090a] border border-red-900/60 p-6 font-mono flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-red-900/40 pb-3">
          <span className="text-xs font-bold text-red-400 flex items-center gap-2 uppercase tracking-wide">
            ⚠️ ANALYSIS PIPELINE NOTICE
          </span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-slate-300 hover:text-white underline font-semibold cursor-pointer"
            >
              Retry
            </button>
          )}
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">{error}</p>
      </div>
    );
  }

  // Data Source Unavailable Notice (Honest Zero-Mock Fallback)
  if (statusNotice && !statusNotice.canAnalyze) {
    return (
      <div className="w-full bg-[#0a0d14] border border-cyan-900/60 p-6 font-mono flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-cyan-400"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              AI COPILOT ANALYSIS STATUS
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 text-cyan-300 border border-cyan-800">
            {statusNotice.code}
          </span>
        </div>
        <div className="text-xs text-slate-300 leading-relaxed flex flex-col gap-3 font-sans">
          <p className="font-mono text-slate-300">{statusNotice.message}</p>
          <div className="p-3 bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
            <span className="font-bold text-cyan-400">ENGINEERING RULE ENFORCED:</span> ChainPilot AI reasons strictly over verified live Subgraph index payloads. Mocked or fabricated portfolio data is prohibited.
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Position Breakdown List */}
      <div className="flex flex-col gap-6">
        {analysis.positionSummaries.map((pos) => {
          const { tickLower, tickUpper, currentTick } = extractTicks(pos);

          return (
            <div
              key={pos.positionId}
              className="w-full bg-[#080a0e] border border-slate-800 p-5 flex flex-col gap-5 shadow-2xl"
            >
              {/* Position Header Identifier */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-base text-slate-100 font-mono tracking-tight">
                    {pos.tokenPair}
                  </span>
                  <span className="text-xs text-slate-400 font-mono bg-slate-900 px-2 py-0.5 border border-slate-800">
                    {pos.protocol}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 border border-slate-800">
                    NFT #{pos.positionId}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${getRiskBadgeColor(pos.riskLevel)}`}>
                    RISK: {pos.riskLevel}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                    pos.rangeStatus === 'IN_RANGE'
                      ? 'bg-[#BAF24A]/10 text-[#BAF24A] border-[#BAF24A]/40'
                      : 'bg-red-950/60 text-red-400 border-red-800'
                  }`}>
                    {pos.rangeStatus}
                  </span>
                </div>
              </div>

              {/* TWO DISTINCT PANELS FOR PRODUCT IDENTITY & TRUST */}

              {/* PANEL 1: VERIFIED ON-CHAIN DATA (DETERMINISTIC FROM THE GRAPH) */}
              <div className="bg-[#05070a] border border-cyan-950/80 p-4 flex flex-col gap-3 font-mono">
                <div className="flex items-center justify-between border-b border-cyan-950/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-cyan-400"></span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-300">
                      VERIFIED ON-CHAIN DATA
                    </span>
                  </div>
                  <span className="text-[9px] text-cyan-400/80 uppercase tracking-widest border border-cyan-900/60 px-2 py-0.5 bg-cyan-950/40">
                    DETERMINISTIC SUBGRAPH TELEMETRY
                  </span>
                </div>

                {/* Liquidity Range Visualizer Instrument */}
                <LiquidityRangeVisualizer
                  tickLower={tickLower}
                  tickUpper={tickUpper}
                  currentTick={currentTick}
                  rangeStatus={pos.rangeStatus}
                />

                {/* Evidence Citations Grid */}
                {pos.evidence && pos.evidence.length > 0 && (
                  <div className="mt-1 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Verified Index References:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {pos.evidence.map((ev, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-slate-950 border border-slate-800 text-[10px] font-mono flex items-center justify-between text-slate-300"
                        >
                          <span className="text-slate-400 font-semibold">{ev.field}:</span>
                          <span className="font-bold text-cyan-300">{ev.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* PANEL 2: AI RISK INTERPRETATION (GEMINI REASONING ENGINE) */}
              <div className="bg-[#07080d] border border-indigo-950/80 p-4 flex flex-col gap-3 font-mono">
                <div className="flex items-center justify-between border-b border-indigo-950/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-indigo-400"></span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-300">
                      AI RISK INTERPRETATION
                    </span>
                  </div>
                  <span className="text-[9px] text-indigo-400/80 uppercase tracking-widest border border-indigo-900/60 px-2 py-0.5 bg-indigo-950/40">
                    GEMINI 3.6 REASONING EVALUATION
                  </span>
                </div>

                {/* Grounded Summary Text */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans font-normal pt-1">
                  {pos.summary}
                </p>

                {/* Suggested Action Box */}
                {pos.suggestedAction && (
                  <div className="mt-2 p-3 bg-slate-950 border border-cyan-900/60 flex flex-col gap-2 font-mono">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                        💡 SUGGESTED ACTION: {pos.suggestedAction.title}
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800">
                        {pos.suggestedAction.actionType}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 font-sans">{pos.suggestedAction.description}</p>

                    {pos.suggestedAction.riskWarning && (
                      <p className="text-[10px] text-amber-400 font-mono">
                        Notice: {pos.suggestedAction.riskWarning}
                      </p>
                    )}

                    {/* Review Action Trigger Button */}
                    {onSelectAction && (
                      <div className="pt-1">
                        <button
                          onClick={() => onSelectAction(pos.suggestedAction!, pos)}
                          className="w-full sm:w-auto px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg border border-cyan-400/40"
                        >
                          🔍 Review Action Proposal
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
