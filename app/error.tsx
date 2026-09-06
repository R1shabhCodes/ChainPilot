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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#090d16] text-slate-100 p-6">
      <div className="max-w-md w-full glass-panel border-red-900/40 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
        <div className="h-12 w-12 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 flex items-center justify-center text-xl font-bold">
          ⚠️
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-100">Something went wrong</h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
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
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
