'use client';

import {
  PortfolioAnalysisResponse,
  RiskLevel,
} from '@/lib/ai/types';

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
}

function getRiskBadgeColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW':
      return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
    case 'MODERATE':
      return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
    case 'HIGH':
      return 'bg-orange-950/80 text-orange-300 border-orange-800/60';
    case 'CRITICAL':
      return 'bg-red-950/80 text-red-300 border-red-800/60';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700';
  }
}

export default function AIRiskCard({
  analysis,
  loading,
  statusNotice,
  error,
  onRetry,
}: AIRiskCardProps) {
  // Loading State
  if (loading) {
    return (
      <div className="w-full glass-panel rounded-2xl p-6 border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-4 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 animate-pulse"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              AI Risk Reasoning Engine
            </h3>
          </div>
        </div>
        <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-400">
          <div className="h-7 w-7 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin"></div>
          <span className="text-xs font-medium">Evaluating On-Chain Data via Gemini AI...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full glass-panel rounded-2xl p-6 border-red-900/50 bg-red-950/20 backdrop-blur-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-red-400 flex items-center gap-2">
            ⚠️ Analysis Pipeline Notice
          </span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-slate-300 hover:text-white underline font-medium"
            >
              Retry
            </button>
          )}
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{error}</p>
      </div>
    );
  }

  // Data Source Unavailable Notice (Honest Zero-Mock Fallback)
  if (statusNotice && !statusNotice.canAnalyze) {
    return (
      <div className="w-full glass-panel rounded-2xl p-6 border-indigo-900/40 bg-indigo-950/20 backdrop-blur-md flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              AI Copilot Analysis Status
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-indigo-800/50">
            {statusNotice.code}
          </span>
        </div>
        <div className="text-xs text-slate-300 leading-relaxed flex flex-col gap-2">
          <p>{statusNotice.message}</p>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-200">Engineering Rule Enforced:</span> ChainPilot AI reasons strictly over verified live Subgraph index payloads. Mocked or fabricated portfolio data is prohibited.
          </div>
        </div>
      </div>
    );
  }

  // Real Portfolio Analysis Rendering
  if (!analysis) {
    return null;
  }

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center font-bold text-indigo-400">
            AI
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">Portfolio Risk Evaluation</h3>
            <p className="text-[11px] text-slate-400 font-mono">Analyzed: {new Date(analysis.analyzedAt).toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Risk Score</div>
            <div className="text-lg font-extrabold text-slate-100">{analysis.overallRiskScore}/100</div>
          </div>
          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getRiskBadgeColor(analysis.overallRiskLevel)}`}>
            {analysis.overallRiskLevel}
          </span>
        </div>
      </div>

      {/* Position Summaries */}
      <div className="flex flex-col gap-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Position Breakdowns ({analysis.positionSummaries.length})
        </h4>

        {analysis.positionSummaries.map((pos) => (
          <div key={pos.positionId} className="p-4 rounded-xl glass-panel bg-slate-950/50 border-slate-800/60 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-100">{pos.tokenPair}</span>
                <span className="text-xs text-slate-400 font-mono">({pos.protocol})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadgeColor(pos.riskLevel)}`}>
                  {pos.riskLevel}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {pos.rangeStatus}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{pos.summary}</p>

            {/* Evidence Citations */}
            {pos.evidence && pos.evidence.length > 0 && (
              <div className="mt-1 pt-2 border-t border-slate-800/40 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400">Verified On-Chain Evidence:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pos.evidence.map((ev, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800/60 text-[11px] font-mono text-slate-300 flex justify-between">
                      <span className="text-slate-400">{ev.field}:</span>
                      <span>{ev.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested User Action */}
            {pos.suggestedAction && (
              <div className="mt-2 p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/50 text-xs flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    💡 Suggested Action: {pos.suggestedAction.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {pos.suggestedAction.actionType}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{pos.suggestedAction.description}</p>
                {pos.suggestedAction.riskWarning && (
                  <p className="text-[10px] text-amber-300 font-mono">Notice: {pos.suggestedAction.riskWarning}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
