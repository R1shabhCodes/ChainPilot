'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected runtime errors to console for debugging
    console.error('Unhandled ChainPilot Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center t-bg t-text p-6">
      <div className="max-w-md w-full bg-[var(--cp-surface)] border border-red-900/40 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
        <div className="h-12 w-12 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 flex items-center justify-center text-xl font-bold">
          ⚠️
        </div>
        <div>
          <h2 className="text-lg font-bold t-text-heading">Something went wrong</h2>
          <p className="text-xs t-text-secondary mt-1 leading-relaxed">
            An unexpected error occurred while rendering this page.
          </p>
          {error.message && (
            <div className="mt-3 p-2.5 rounded-lg bg-red-950/40 border border-red-900/50 font-mono text-xs text-red-300 text-left overflow-x-auto">
              {error.message}
            </div>
          )}
        </div>

        <button
          onClick={() => reset()}
          className="w-full py-2.5 px-4 rounded-xl bg-[var(--cp-surface-elevated)] hover:bg-[var(--cp-surface-highlight)] border t-border text-xs font-semibold t-text transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
