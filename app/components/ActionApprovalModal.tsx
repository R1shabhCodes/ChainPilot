'use client';

import { SuggestedAction, PositionRiskSummary } from '@/lib/ai/types';

export interface ActionApprovalModalProps {
  isOpen: boolean;
  action: SuggestedAction | null;
  position: PositionRiskSummary | null;
  onClose: () => void;
}

export default function ActionApprovalModal({
  isOpen,
  action,
  position,
  onClose,
}: ActionApprovalModalProps) {
  if (!isOpen || !action) {
    return null;
  }

  const hasExecutablePayload = Boolean(
    action.executablePayload &&
      action.executablePayload.to &&
      action.executablePayload.data
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg glass-panel rounded-2xl p-6 border-slate-800 bg-slate-900/95 shadow-2xl flex flex-col gap-5 text-slate-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center font-bold text-cyan-400 text-sm">
              AI
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Review AI Action Proposal</h3>
              <p className="text-xs text-slate-400 font-mono">ID: {action.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors text-sm font-bold cursor-pointer"
            aria-label="Close action modal"
          >
            ✕
          </button>
        </div>

        {/* Action Type & Title */}
        <div className="flex flex-col gap-2 p-4 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Action Type</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              {action.actionType}
            </span>
          </div>
          <h4 className="font-bold text-sm text-cyan-300">{action.title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{action.description}</p>
        </div>

        {/* Position Context */}
        {position && (
          <div className="flex flex-col gap-2">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Target Position Context
            </h5>
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-200 font-bold">{position.tokenPair}</span>
              <span className="text-slate-400">Range: {position.rangeStatus}</span>
              <span className="text-slate-400">Risk: {position.riskLevel}</span>
            </div>
          </div>
        )}

        {/* Verified Evidence Citations */}
        {position && position.evidence && position.evidence.length > 0 && (
          <div className="flex flex-col gap-2">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Supporting Evidence Citations
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {position.evidence.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/50 text-[11px] font-mono flex flex-col gap-0.5"
                >
                  <span className="text-slate-400">{ev.field}</span>
                  <span className="text-cyan-300 font-semibold">{ev.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Parameters */}
        {action.suggestedParameters && Object.keys(action.suggestedParameters).length > 0 && (
          <div className="flex flex-col gap-2">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Suggested Parameters
            </h5>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 font-mono text-xs text-slate-300 flex flex-col gap-1">
              {Object.entries(action.suggestedParameters).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-slate-400">{key}:</span>
                  <span className="text-slate-200">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Warning Notice */}
        {action.riskWarning && (
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-300 flex flex-col gap-1">
            <span className="font-bold flex items-center gap-1.5">⚠️ Risk Advisory:</span>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">{action.riskWarning}</p>
          </div>
        )}

        {/* Execution Safety Gate */}
        <div className="mt-1 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex flex-col gap-2 text-slate-400">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <span className="h-2 w-2 rounded-full bg-slate-500"></span>
            Execution Safety Gate Status
          </div>
          {hasExecutablePayload ? (
            <p className="text-[11px] text-emerald-400 leading-relaxed">
              Verified transaction payload is ready for Privy wallet sign-off.
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Transaction execution is not yet available. ChainPilot currently provides analysis and recommendations only. Automated or unverified transaction execution is disabled.
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Cancel / Dismiss
          </button>
          <button
            disabled={!hasExecutablePayload}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              hasExecutablePayload
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer shadow-lg shadow-cyan-950/50'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60 border border-slate-700/50'
            }`}
          >
            {hasExecutablePayload ? 'Approve & Execute via Privy' : 'Execution Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}
