'use client';

import { PortfolioAnalysisResponse, RiskLevel } from '@/lib/ai/types';
import { AnalyzeStatusNotice } from './AIRiskCard';

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
        colorClass: 'bg-[var(--status-green-bg)] text-[var(--status-green)] border-[var(--status-green)]',
        barFillClass: 'bg-[var(--status-green)]',
      };
    case 'MODERATE':
      return {
        colorClass: 'bg-[var(--status-amber-bg)] text-[var(--status-amber)] border-[var(--status-amber)]',
        barFillClass: 'bg-[var(--status-amber)]',
      };
    case 'HIGH':
      return {
        colorClass: 'bg-[var(--accent-orange-glow)] text-[var(--accent-orange)] border-[var(--accent-orange)]',
        barFillClass: 'bg-[var(--accent-orange)]',
      };
    case 'CRITICAL':
      return {
        colorClass: 'bg-[var(--status-red-bg)] text-[var(--status-red)] border-[var(--status-red)]',
        barFillClass: 'bg-[var(--status-red)]',
      };
    default:
      return {
        colorClass: 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border-[var(--border-color)]',
        barFillClass: 'bg-[var(--accent-purple)]',
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
      <div className="w-full panel-sharp border-accent-top p-6 flex flex-col gap-4 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent-purple)] animate-pulse"></span>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
              AI Risk Command Center
            </h3>
          </div>
        </div>
        <div className="py-8 flex flex-col items-center justify-center gap-3 text-[var(--text-muted)]">
          <div className="h-7 w-7 rounded-full border-2 border-[var(--accent-purple-glow)] border-t-[var(--accent-purple)] animate-spin"></div>
          <span className="text-xs font-mono">Evaluating On-Chain Telemetry via Gemini AI...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full panel-sharp border-[var(--status-red)] bg-[var(--status-red-bg)] p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[var(--status-red)] flex items-center gap-2">
            ⚠️ Analysis Error Notice
          </span>
        </div>
        <p className="text-xs font-sans text-[var(--text-primary)] leading-relaxed">{error}</p>
      </div>
    );
  }

  // Status Notice State (Unavailable or Zero Positions)
  if (statusNotice && !statusNotice.canAnalyze) {
    return (
      <div className="w-full panel-sharp border-orange-top p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent-orange)]"></span>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Risk Evaluation Status
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--accent-orange)] border border-[var(--border-color)]">
            {statusNotice.code}
          </span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{statusNotice.message}</p>
      </div>
    );
  }

  // Pending State (No address / no analysis yet)
  if (!analysis) {
    return (
      <div className="w-full panel-sharp border-accent-top p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--text-muted)]"></span>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
              AI Risk Command Center
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border border-[var(--border-color)]">
            STANDBY
          </span>
        </div>
        <div className="py-6 flex flex-col items-center justify-center gap-2 text-center text-[var(--text-muted)]">
          <span className="text-xs font-mono">Select or enter an EVM address to generate verified AI risk telemetry.</span>
        </div>
      </div>
    );
  }

  // Verified Analysis State
  const riskStyle = getRiskBadgeStyle(analysis.overallRiskLevel);
  const positionCount = analysis.positionSummaries?.length || 0;
  const clampedScore = Math.min(100, Math.max(0, analysis.overallRiskScore));

  return (
    <div className="w-full panel-sharp border-accent-top p-6 flex flex-col gap-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--accent-purple)] animate-pulse"></span>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Portfolio Risk Command Center
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          Analyzed: {new Date(analysis.analyzedAt).toLocaleTimeString()}
        </span>
      </div>

      {/* Main Score & Risk Badge Display */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Overall Portfolio Risk Score
          </span>
          <div className="flex items-baseline gap-3">
            <span className="font-display font-extrabold text-5xl sm:text-6xl text-[var(--text-primary)] tracking-tight">
              {analysis.overallRiskScore}
            </span>
            <span className="font-mono text-sm text-[var(--text-muted)]">/ 100</span>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1.5">
          <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Verified Risk Tier</span>
          <span className={`px-3.5 py-1 rounded text-xs font-mono font-bold border ${riskStyle.colorClass}`}>
            {analysis.overallRiskLevel}
          </span>
        </div>
      </div>

      {/* Financial Segmented Risk Meter Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="w-full h-2.5 rounded-sm bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] overflow-hidden relative">
          <div
            className={`h-full transition-all duration-700 ease-out ${riskStyle.barFillClass}`}
            style={{ width: `${clampedScore}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)] pt-0.5">
          <span>0 (Low Risk)</span>
          <span>50 (Moderate)</span>
          <span>100 (Critical)</span>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-purple)]"></span>
          <span>Analyzed Positions:</span>
          <span className="font-bold text-[var(--text-primary)]">{positionCount}</span>
        </div>
        <span className="text-[11px] text-[var(--text-muted)]">The Graph Subgraph Telemetry</span>
      </div>
    </div>
  );
}
