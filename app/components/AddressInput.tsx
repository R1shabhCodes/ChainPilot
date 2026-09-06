'use client';

import { useState } from 'react';

interface AddressInputProps {
  onAnalyze?: (address: string) => void;
}

export default function AddressInput({ onAnalyze }: AddressInputProps) {
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeAddress, setActiveAddress] = useState<string | null>(null);

  // Validate EVM address format (0x followed by 40 hex chars)
  const validateAddress = (input: string): boolean => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter a wallet address.');
      return false;
    }

    if (trimmed.toLowerCase().endsWith('.eth')) {
      setError('ENS resolution coming soon. Please enter a 0x... EVM address.');
      return false;
    }

    const evmRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!evmRegex.test(trimmed)) {
      setError('Invalid EVM address format. Must start with 0x followed by 40 hex characters.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddress(address)) return;

    const cleanAddress = address.trim();
    setIsLoading(true);

    // Simulate submission handler for UX feedback
    setTimeout(() => {
      setIsLoading(false);
      setActiveAddress(cleanAddress);
      if (onAnalyze) {
        onAnalyze(cleanAddress);
      }
    }, 600);
  };

  const handleClear = () => {
    setAddress('');
    setError(null);
    setIsLoading(false);
    setActiveAddress(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Enter EVM wallet address (0x...)"
            className={`w-full px-4 py-3.5 text-sm rounded-xl glass-panel bg-slate-900/90 text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
              error
                ? 'border-red-500/80 focus:border-red-400'
                : activeAddress
                ? 'border-emerald-500/80 focus:border-emerald-400'
                : 'border-slate-700/80 focus:border-cyan-500'
            }`}
            disabled={isLoading}
          />
          {address && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded bg-slate-800/80"
              disabled={isLoading}
            >
              Clear
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 min-w-[150px]"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
              Analyzing...
            </>
          ) : (
            'Analyze Portfolio'
          )}
        </button>
      </form>

      {/* Validation Error Alert */}
      {error && (
        <div className="px-4 py-2.5 rounded-lg bg-red-950/60 border border-red-800/50 text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
          <span className="font-bold">⚠️ Notice:</span>
          <span>{error}</span>
        </div>
      )}

      {/* Active Address Status Banner */}
      {activeAddress && !error && (
        <div className="px-4 py-3 rounded-xl glass-panel border-emerald-800/50 bg-emerald-950/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">Active Address:</span>
            <span className="font-mono text-slate-200">{activeAddress}</span>
          </div>
          <button
            onClick={handleClear}
            className="text-slate-400 hover:text-slate-200 underline text-xs"
          >
            Change Address
          </button>
        </div>
      )}
    </div>
  );
}
