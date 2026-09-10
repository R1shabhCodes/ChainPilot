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
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl p-6 border t-border-strong bg-[var(--cp-surface)] shadow-2xl flex flex-col gap-5 t-text relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b t-border pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-500 text-sm">
              AI
            </div>
            <div>
              <h3 className="font-bold text-base t-text-heading">Review AI Action Proposal</h3>
              <p className="text-xs t-text-muted font-mono">ID: {action.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-[var(--cp-surface-elevated)] hover:bg-[var(--cp-surface-highlight)] t-text-muted hover:t-text flex items-center justify-center transition-colors text-sm font-bold cursor-pointer"
            aria-label="Close action modal"
          >
            ✕
          </button>
        </div>

        {/* Action Type & Title */}
        <div className="flex flex-col gap-2 p-4 rounded-xl bg-[var(--cp-surface-elevated)] border t-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold t-text-secondary">Action Type</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/40">
              {action.actionType}
            </span>
          </div>
          <h4 className="font-bold text-sm text-cyan-500">{action.title}</h4>
          <p className="text-xs t-text-secondary leading-relaxed">{action.description}</p>
        </div>

        {/* Position Context */}
        {position && (
          <div className="flex flex-col gap-2">
            <h5 className="text-[11px] font-bold uppercase tracking-wider t-text-muted">
              Target Position Context
            </h5>
            <div className="p-3 rounded-xl bg-[var(--cp-surface-elevated)] border t-border flex items-center justify-between text-xs font-mono">
              <span className="t-text font-bold">{position.tokenPair}</span>
              <span className="t-text-secondary">Range: {position.rangeStatus}</span>
              <span className="t-text-secondary">Risk: {position.riskLevel}</span>
            </div>
          </div>
        )}

        {/* Verified Evidence Citations */}
        {position && position.evidence && position.evidence.length > 0 && (
          <div className="flex flex-col gap-2">
            <h5 className="text-[11px] font-bold uppercase tracking-wider t-text-muted">
              Supporting Evidence Citations
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {position.evidence.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[var(--cp-surface-elevated)] border t-border text-[11px] font-mono flex flex-col gap-0.5"
                >
                  <span className="t-text-muted">{ev.field}</span>
                  <span className="text-cyan-500 font-semibold">{ev.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Parameters */}
        {action.suggestedParameters && Object.keys(action.suggestedParameters).length > 0 && (
          <div className="flex flex-col gap-2">
            <h5 className="text-[11px] font-bold uppercase tracking-wider t-text-muted">
              Suggested Parameters
            </h5>
            <div className="p-3 rounded-xl bg-[var(--cp-surface-elevated)] border t-border font-mono text-xs t-text-secondary flex flex-col gap-1">
              {Object.entries(action.suggestedParameters).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span className="t-text-muted">{key}:</span>
                  <span className="t-text">{val}</span>
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
        <div className="mt-1 p-3.5 rounded-xl bg-[var(--cp-surface-elevated)] border t-border text-xs flex flex-col gap-2 t-text-muted">
          <div className="flex items-center gap-2 font-bold t-text-secondary">
            <span className="h-2 w-2 rounded-full bg-slate-500"></span>
            Execution Safety Gate Status
          </div>
          {hasExecutablePayload ? (
            <p className="text-[11px] text-emerald-500 leading-relaxed">
              Verified transaction payload is ready for Privy wallet sign-off.
            </p>
          ) : (
            <p className="text-[11px] t-text-muted leading-relaxed">
              Transaction execution is not yet available. ChainPilot currently provides analysis and recommendations only. Automated or unverified transaction execution is disabled.
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t t-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[var(--cp-surface-elevated)] hover:bg-[var(--cp-surface-highlight)] t-text-secondary hover:t-text font-medium text-xs transition-colors cursor-pointer border t-border"
          >
            Cancel / Dismiss
          </button>
          <button
            disabled={!hasExecutablePayload}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              hasExecutablePayload
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer shadow-lg shadow-cyan-500/20'
                : 'bg-[var(--cp-surface-elevated)] t-text-muted cursor-not-allowed opacity-60 border t-border'
            }`}
          >
            {hasExecutablePayload ? 'Approve & Execute via Privy' : 'Execution Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}
