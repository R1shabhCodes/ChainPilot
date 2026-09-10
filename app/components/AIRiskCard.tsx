'use client';

import React from 'react';
import {
  PortfolioAnalysisResponse,
  PositionRiskSummary,
  RiskLevel,
  SuggestedAction,
} from '@/lib/ai/types';
import LiquidityRangeVisualizer from './LiquidityRangeVisualizer';
import {
  getEtherscanNftUrl,
  getEtherscanPoolUrl,
  getEtherscanTokenUrl,
  shortenAddress,
} from '@/lib/utils/explorer';

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
    ? analysis.positionSummaries.find((p) => p.positionId === focusedPositionId) || analysis.positionSummaries[0]
    : analysis.positionSummaries[0];

  if (!pos) return null;

  const { tickLower, tickUpper, currentTick } = extractTicks(pos);

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn">
      {/* DOMINANT POSITION HEADER */}
      <div className="w-full panel-architecture bg-[var(--cp-surface)] p-6 flex flex-col gap-4 border-t-2 border-t-cyan-500 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b t-border pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="font-display font-black text-3xl t-text-heading tracking-tighter uppercase">
                {pos.tokenPair}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 font-mono flex-wrap">
              <span className="text-[10px] t-text-muted uppercase tracking-widest bg-[var(--cp-bg)] border t-border px-2 py-1">
                {pos.protocol}
              </span>
              <a
                href={getEtherscanNftUrl(pos.positionId)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-cyan-500 hover:text-cyan-400 font-bold font-mono uppercase tracking-widest flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 px-2 py-1 transition-colors"
                title="Verify Position NFT on Etherscan"
              >
                POSITION NFT #{pos.positionId} ↗
              </a>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 font-mono">
            <span className="text-[9px] t-text-muted uppercase tracking-widest font-bold">AI Risk Assessment</span>
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

      {/* THREE EXPLICIT DATA LAYERS: VERIFIED ON-CHAIN DATA | COMPUTED DIAGNOSIS | AI INTERPRETATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LAYER 1: VERIFIED ON-CHAIN DATA */}
        <div className="panel-architecture bg-[var(--cp-surface)] p-5 flex flex-col gap-4 border-t-2 border-t-cyan-500/80">
          <div className="flex items-center justify-between border-b t-border pb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-cyan-500"></span>
              LAYER 1: VERIFIED ON-CHAIN DATA
            </span>
            <span className="text-[8px] text-cyan-500/60 uppercase tracking-widest font-mono">
              THE GRAPH SUBGRAPH
            </span>
          </div>

          <div className="flex flex-col gap-2 font-mono text-xs">
            <div className="flex justify-between items-center border-b t-border pb-2">
              <span className="t-text-muted uppercase text-[10px]">Position NFT</span>
              <a
                href={getEtherscanNftUrl(pos.positionId)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-cyan-500 hover:underline flex items-center gap-1"
                title="Verify NFT on Etherscan"
              >
                #{pos.positionId} ↗
              </a>
            </div>
            <div className="flex justify-between border-b t-border pb-2">
              <span className="t-text-muted uppercase text-[10px]">Token Pair</span>
              <span className="font-bold t-text">{pos.tokenPair}</span>
            </div>
            <div className="flex justify-between border-b t-border pb-2">
              <span className="t-text-muted uppercase text-[10px]">Protocol</span>
              <span className="font-bold t-text">{pos.protocol}</span>
            </div>
            {pos.poolAddress && (
              <div className="flex justify-between items-center border-b t-border pb-2">
                <span className="t-text-muted uppercase text-[10px]">Pool Contract</span>
                <a
                  href={getEtherscanPoolUrl(pos.poolAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-cyan-500 hover:underline flex items-center gap-1"
                  title={pos.poolAddress}
                >
                  {shortenAddress(pos.poolAddress)} ↗
                </a>
              </div>
            )}
            {pos.token0Address && (
              <div className="flex justify-between items-center border-b t-border pb-2">
                <span className="t-text-muted uppercase text-[10px]">Token0 Contract</span>
                <a
                  href={getEtherscanTokenUrl(pos.token0Address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-cyan-500 hover:underline flex items-center gap-1"
                  title={pos.token0Address}
                >
                  {shortenAddress(pos.token0Address)} ↗
                </a>
              </div>
            )}
            {pos.token1Address && (
              <div className="flex justify-between items-center border-b t-border pb-2">
                <span className="t-text-muted uppercase text-[10px]">Token1 Contract</span>
                <a
                  href={getEtherscanTokenUrl(pos.token1Address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-cyan-500 hover:underline flex items-center gap-1"
                  title={pos.token1Address}
                >
                  {shortenAddress(pos.token1Address)} ↗
                </a>
              </div>
            )}
            <div className="flex justify-between border-b t-border pb-2">
              <span className="t-text-muted uppercase text-[10px]">Current Pool Tick</span>
              <span className="font-bold text-cyan-500">{currentTick !== null ? currentTick.toLocaleString('en-US') : 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b t-border pb-2">
              <span className="t-text-muted uppercase text-[10px]">Lower Tick Bound</span>
              <span className="font-bold t-text-secondary">{tickLower !== null ? tickLower.toLocaleString('en-US') : 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b t-border pb-2">
              <span className="t-text-muted uppercase text-[10px]">Upper Tick Bound</span>
              <span className="font-bold t-text-secondary">{tickUpper !== null ? tickUpper.toLocaleString('en-US') : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* LAYER 2: COMPUTED RANGE DIAGNOSIS */}
        <div className="panel-architecture bg-[var(--cp-surface)] p-5 flex flex-col gap-4 border-t-2 border-t-[#baf24a]/80">
          <div className="flex items-center justify-between border-b t-border pb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#baf24a] flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-[#baf24a]"></span>
              LAYER 2: COMPUTED RANGE DIAGNOSIS
            </span>
            <span className="text-[8px] text-[#baf24a]/60 uppercase tracking-widest font-mono">
              DETERMINISTIC ENGINE
            </span>
          </div>

          <div className="flex flex-col gap-3 font-mono">
            {pos.computedMetrics ? (
              <>
                <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border">
                  <span className="text-[9px] uppercase font-bold t-text-muted block mb-1">
                    STATUS DIAGNOSIS
                  </span>
                  <span className={`text-xs font-black uppercase ${
                    pos.computedMetrics.isInRange ? 'text-[#baf24a]' : 'text-red-400'
                  }`}>
                    {pos.computedMetrics.rangeDiagnosisText}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2.5 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-0.5">
                    <span className="t-text-muted uppercase font-bold">Lower Bound Dist</span>
                    <span className="font-bold text-xs t-text">
                      {pos.computedMetrics.tickDistanceLower !== null
                        ? `${pos.computedMetrics.tickDistanceLower.toLocaleString('en-US')} ticks`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-0.5">
                    <span className="t-text-muted uppercase font-bold">Upper Bound Dist</span>
                    <span className="font-bold text-xs t-text">
                      {pos.computedMetrics.tickDistanceUpper !== null
                        ? `${pos.computedMetrics.tickDistanceUpper.toLocaleString('en-US')} ticks`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border text-xs t-text-muted">
                Status: <span className="font-bold text-cyan-500">{pos.rangeStatus}</span>
              </div>
            )}
          </div>
        </div>

        {/* LAYER 3: AI RISK INTERPRETATION */}
        <div className="panel-architecture bg-[var(--cp-surface)] p-5 flex flex-col gap-4 border-t-2 border-t-purple-500/80">
          <div className="flex items-center justify-between border-b t-border pb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-purple-500"></span>
              LAYER 3: AI RISK INTERPRETATION
            </span>
            <span className="text-[8px] text-purple-400/80 uppercase tracking-widest font-mono font-bold">
              {analysis.providerStatus?.activeProvider || 'AI ENGINE'}
            </span>
          </div>

          {analysis.aiStatus === 'UNAVAILABLE' ? (
            <div className="flex flex-col gap-3 font-mono">
              <div className="p-3 bg-amber-950/20 border border-amber-800/60 flex flex-col gap-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  ⚠️ AI INTERPRETATION UNAVAILABLE
                </span>
                <p className="text-xs t-text-secondary leading-relaxed font-sans">
                  On-chain position data and computed range diagnoses are 100% verified above. Natural language AI interpretation is currently offline or rate-limited.
                </p>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-widest py-1.5 px-3 transition-colors"
                  >
                    [ RETRY AI ANALYSIS ]
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs t-text-secondary leading-relaxed font-sans mt-1">
              {pos.summary}
            </p>
          )}

          {/* Suggested Action Trigger */}
          {pos.suggestedAction && (
            <div className="mt-auto pt-4 border-t t-border flex flex-col gap-3 font-mono">
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold text-[11px] text-[#baf24a]">
                  RECOMMENDED: {pos.suggestedAction.title}
                </span>
                <span className="text-[8px] px-1.5 py-0.5 bg-[var(--cp-bg)] border t-border t-text-muted font-mono uppercase">
                  {pos.suggestedAction.actionType}
                </span>
              </div>

              {onSelectAction && (
                <button
                  onClick={() => onSelectAction(pos.suggestedAction!, pos)}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[10px] uppercase tracking-widest py-2.5 px-4 transition-colors text-center cursor-pointer"
                >
                  REVIEW ACTION PROPOSAL
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      {/* EVIDENCE & PROVENANCE AUDIT SECTION */}
      {pos.evidence && pos.evidence.length > 0 && (
        <div className="w-full panel-architecture bg-[var(--cp-surface)] p-5 font-mono flex flex-col gap-3 border-cyan-top">
          <div className="flex items-center justify-between border-b t-border pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest t-text flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-cyan-500"></span>
              EVIDENCE & PROVENANCE AUDIT
            </span>
            <span className="text-[9px] t-text-muted uppercase">SUBGRAPH SOURCE CITATIONS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {pos.evidence.map((ev, idx) => (
              <div key={idx} className="p-2.5 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-1">
                <span className="text-[9px] t-text-muted font-bold uppercase tracking-wider">{ev.field}</span>
                <span className="text-xs font-bold t-text">{ev.value}</span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[8px] text-cyan-500 truncate">{ev.sourceRef}</span>
                  <a
                    href={getEtherscanNftUrl(pos.positionId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[8px] text-cyan-500 hover:underline font-bold"
                  >
                    VERIFY ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
