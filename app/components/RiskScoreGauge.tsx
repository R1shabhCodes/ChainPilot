'use client';

import { PortfolioAnalysisResponse, RiskLevel } from '@/lib/ai/types';
import { AnalyzeStatusNotice } from './AIRiskCard';
import { TRANSPARENCY_NOTE, RISK_LEVEL_DESCRIPTIONS } from '@/lib/decision/riskCalculator';

export interface RiskScoreGaugeProps {
  analysis: PortfolioAnalysisResponse | null;
  loading: boolean;
  statusNotice?: AnalyzeStatusNotice | null;
  error?: string | null;
}

function getRiskBadgeStyle(level: RiskLevel): { colorClass: string; barFillClass: string } {
  switch (level) {
    case 'LOW':
      return {
        colorClass: 'bg-[#BAF24A]/10 text-[#BAF24A] border-[#BAF24A]/40',
        barFillClass: 'bg-[#BAF24A]',
      };
    case 'MODERATE':
      return {
        colorClass: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
        barFillClass: 'bg-amber-400',
      };
    case 'HIGH':
      return {
        colorClass: 'bg-orange-950/80 text-orange-400 border-orange-800/80',
        barFillClass: 'bg-orange-500',
      };
    case 'CRITICAL':
      return {
        colorClass: 'bg-red-950/80 text-red-400 border-red-800/80',
        barFillClass: 'bg-red-500',
      };
    default:
      return {
        colorClass: 'bg-slate-900 text-slate-300 border-slate-700',
        barFillClass: 'bg-slate-500',
      };
  }
}

export default function RiskScoreGauge({
  analysis,
  loading,
  statusNotice,
  error,
}: RiskScoreGaugeProps) {
  // Loading State
  if (loading) {
    return (
      <div className="w-full bg-[var(--cp-surface)] border t-border p-5 font-mono flex flex-col gap-3 animate-fadeIn">
        <div className="flex items-center justify-between border-b t-border pb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-cyan-500 animate-pulse"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider t-text">
              CURRENT LP RANGE RISK COMMAND CENTER
            </h3>
          </div>
        </div>
        <div className="py-6 flex flex-col items-center justify-center gap-2 t-text-muted">
          <div className="h-5 w-5 border-2 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
          <span className="text-xs font-mono t-text-muted">CALCULATING DETERMINISTIC RANGE RISK TELEMETRY...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full bg-[#0d090a] border border-red-900/60 p-5 font-mono flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-red-400 flex items-center gap-2 uppercase tracking-wide">
            ⚠️ ANALYSIS ERROR NOTICE
          </span>
        </div>
        <p className="text-xs font-sans text-slate-300 leading-relaxed">{error}</p>
      </div>
    );
  }

  // Status Notice State (Unavailable or Zero Positions)
  if (statusNotice && !statusNotice.canAnalyze) {
    return (
      <div className="w-full bg-[var(--cp-surface)] border border-cyan-500/40 p-5 font-mono flex flex-col gap-3">
        <div className="flex items-center justify-between border-b t-border pb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-cyan-500"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-500">
              CURRENT LP RANGE RISK STATUS
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--cp-surface-elevated)] text-cyan-500 border t-border">
            {statusNotice.code}
          </span>
        </div>
        <p className="text-xs t-text-secondary leading-relaxed font-sans">{statusNotice.message}</p>
      </div>
    );
  }

  // Pending State (No address / no analysis yet)
  if (!analysis) {
    return null;
  }

  // Verified Analysis State
  const isScorePresent = typeof analysis.overallRiskScore === 'number';
  const scoreVal = isScorePresent ? analysis.overallRiskScore! : 0;
  const level: RiskLevel = analysis.overallRiskLevel || 'LOW';
  const riskStyle = getRiskBadgeStyle(level);
  const positionCount = analysis.positionSummaries?.length || 0;
  const clampedScore = Math.min(100, Math.max(0, scoreVal));
  const levelDesc =
    analysis.riskDescription ||
    RISK_LEVEL_DESCRIPTIONS[level] ||
    RISK_LEVEL_DESCRIPTIONS.LOW;

  return (
    <div className="w-full bg-[var(--cp-surface)] border t-border p-5 font-mono flex flex-col gap-5 shadow-2xl animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b t-border pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-cyan-500 animate-pulse"></span>
          <h3 className="text-xs font-bold uppercase tracking-wider t-text">
            CURRENT LP RANGE RISK
          </h3>
        </div>
        <span className="text-[10px] t-text-muted font-mono">
          ANALYZED: {new Date(analysis.analyzedAt).toLocaleTimeString()}
        </span>
      </div>

      {/* Main Score & Risk Badge Display */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold t-text-muted tracking-wider">
            CURRENT LP RANGE RISK SCORE
          </span>
          <div className="flex items-baseline gap-3">
            <span className="font-display font-black text-5xl sm:text-6xl t-text-heading tracking-tight">
              {clampedScore}
            </span>
            <span className="text-sm t-text-muted font-bold">/ 100</span>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1.5">
          <span className="text-[10px] uppercase font-bold t-text-muted tracking-wider">RANGE RISK LEVEL</span>
          <span className={`px-3 py-1 text-xs font-black uppercase border ${riskStyle.colorClass}`}>
            {level} RISK
          </span>
        </div>
      </div>

      {/* Financial Segmented Risk Meter Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="w-full h-3 bg-[var(--cp-surface-elevated)] border t-border relative overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ease-out ${riskStyle.barFillClass}`}
            style={{ width: `${clampedScore}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[9px] font-mono t-text-muted pt-0.5 uppercase">
          <span>0 (Low Range Risk)</span>
          <span>50 (Moderate Range Risk)</span>
          <span>100 (Critical Range Risk)</span>
        </div>
      </div>

      {/* Risk Level Description Notice */}
      <div className="bg-[var(--cp-surface-elevated)] border t-border p-3 rounded-none text-xs font-sans t-text-secondary leading-relaxed flex items-start gap-2.5">
        <span className="text-cyan-500 font-mono text-sm">ℹ️</span>
        <div className="flex flex-col gap-1">
          <span className="font-bold text-xs font-mono t-text-heading uppercase tracking-wide">
            {level} RANGE RISK CONTEXT:
          </span>
          <span>{levelDesc}</span>
        </div>
      </div>

      {/* Official Transparency Note - Theme Aware */}
      <div className="p-2.5 t-surface-el border t-border text-[11px] font-mono t-text-secondary leading-snug">
        <span className="t-text font-bold mr-1">TRANSPARENCY NOTICE:</span>
        {TRANSPARENCY_NOTE}
      </div>

      {/* Telemetry Footer */}
      <div className="pt-3 border-t t-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono t-text-secondary">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-cyan-500"></span>
            <span>Positions:</span>
            <span className="font-bold text-cyan-500">{positionCount}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="t-text-muted">IN RANGE:</span>
            <span className="text-[#baf24a] font-bold">
              {analysis.positionSummaries?.filter((p) => p.rangeStatus === 'IN_RANGE').length || 0}
            </span>
            <span className="t-text-muted ml-2">OUT OF RANGE:</span>
            <span className="text-red-400 font-bold">
              {analysis.positionSummaries?.filter((p) => p.rangeStatus === 'OUT_OF_RANGE').length || 0}
            </span>
          </div>
        </div>

        {/* Real Provider Status Badges */}
        {analysis.providerStatus && (
          <div className="flex items-center gap-2 text-[9px] font-mono">
            <span className="t-text-muted uppercase font-bold">Provider Status:</span>
            <span className={`px-2 py-0.5 border font-bold uppercase ${
              analysis.providerStatus.activeProvider === 'GROQ'
                ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/40'
                : analysis.providerStatus.groqStatus === 'RATE_LIMITED'
                ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                : 'bg-[var(--cp-surface-elevated)] t-text-muted t-border'
            }`}>
              Groq: {analysis.providerStatus.groqStatus}
            </span>
            <span className={`px-2 py-0.5 border font-bold uppercase ${
              analysis.providerStatus.activeProvider === 'GEMINI'
                ? 'bg-[#d075ff]/10 text-[#d075ff] border-[#d075ff]/40'
                : analysis.providerStatus.geminiStatus === 'RATE_LIMITED'
                ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                : 'bg-[var(--cp-surface-elevated)] t-text-muted t-border'
            }`}>
              Gemini: {analysis.providerStatus.geminiStatus}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

