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
      <div className="w-full bg-[#0a0d14] border border-slate-800 p-5 font-mono flex flex-col gap-3 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#00F0FF] animate-pulse"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              PORTFOLIO RISK COMMAND HEADER
            </h3>
          </div>
        </div>
        <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-400">
          <div className="h-5 w-5 border-2 border-[#00F0FF]/20 border-t-[#00F0FF] animate-spin"></div>
          <span className="text-xs font-mono">Evaluating On-Chain Telemetry via Gemini AI...</span>
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
      <div className="w-full bg-[#0a0d14] border border-cyan-900/60 p-5 font-mono flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-cyan-400"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              RISK EVALUATION STATUS
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 text-cyan-300 border border-cyan-800">
            {statusNotice.code}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">{statusNotice.message}</p>
      </div>
    );
  }

  // Pending State (No address / no analysis yet)
  if (!analysis) {
    return null;
  }

  // Verified Analysis State
  const isAiAvailable = typeof analysis.overallRiskScore === 'number' && analysis.overallRiskLevel;
  const level: RiskLevel = analysis.overallRiskLevel || 'MODERATE';
  const riskStyle = getRiskBadgeStyle(level);
  const positionCount = analysis.positionSummaries?.length || 0;
  const clampedScore = isAiAvailable ? Math.min(100, Math.max(0, analysis.overallRiskScore!)) : 0;

  return (
    <div className="w-full bg-[#090b10] border border-slate-800 p-5 font-mono flex flex-col gap-5 shadow-2xl animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 ${isAiAvailable ? 'bg-[#00F0FF] animate-pulse' : 'bg-amber-400'}`}></span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            PORTFOLIO RISK COMMAND CENTER
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          ANALYZED: {new Date(analysis.analyzedAt).toLocaleTimeString()}
        </span>
      </div>

      {/* Main Score & Risk Badge Display */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            OVERALL RISK SCORE
          </span>
          <div className="flex items-baseline gap-3">
            {isAiAvailable ? (
              <>
                <span className="font-display font-black text-5xl sm:text-6xl text-slate-100 tracking-tight">
                  {analysis.overallRiskScore}
                </span>
                <span className="text-sm text-slate-400 font-bold">/ 100</span>
              </>
            ) : (
              <span className="font-display font-bold text-xl text-amber-400 tracking-tight uppercase">
                AI INTERPRETATION UNAVAILABLE
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">DATA TIER</span>
          {isAiAvailable ? (
            <span className={`px-3 py-1 text-xs font-black uppercase border ${riskStyle.colorClass}`}>
              {analysis.overallRiskLevel} RISK
            </span>
          ) : (
            <span className="px-3 py-1 text-xs font-black uppercase border bg-cyan-950/80 text-cyan-300 border-cyan-800">
              ON-CHAIN DATA VERIFIED
            </span>
          )}
        </div>
      </div>

      {/* Financial Segmented Risk Meter Bar */}
      {isAiAvailable && (
        <div className="flex flex-col gap-1.5">
          <div className="w-full h-3 bg-slate-950 border border-slate-800 relative overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-out ${riskStyle.barFillClass}`}
              style={{ width: `${clampedScore}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-0.5 uppercase">
            <span>0 (Low Risk)</span>
            <span>50 (Moderate)</span>
            <span>100 (Critical)</span>
          </div>
        </div>
      )}

      {/* Telemetry Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-[#00F0FF]"></span>
          <span>Analyzed Positions:</span>
          <span className="font-bold text-[#00F0FF]">{positionCount}</span>
        </div>
        <span className="text-[10px] text-slate-400">The Graph Subgraph Payload</span>
      </div>
    </div>
  );
}
