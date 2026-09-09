'use client';

import { useState, useEffect } from 'react';

interface AddressInputProps {
  externalAddress?: string | null;
  onAnalyze?: (address: string) => void;
}

export default function AddressInput({ externalAddress, onAnalyze }: AddressInputProps) {
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeAddress, setActiveAddress] = useState<string | null>(null);

  // Sync with externalAddress prop (e.g. from Privy login or parent selection)
  useEffect(() => {
    if (externalAddress) {
      setAddress(externalAddress);
      if (/^0x[a-fA-F0-9]{40}$/.test(externalAddress)) {
        setError(null);
        setActiveAddress(externalAddress);
      }
    } else if (externalAddress === null) {
      setAddress('');
      setError(null);
      setActiveAddress(null);
    }
  }, [externalAddress]);

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
            className={`w-full px-4 py-3.5 text-sm font-mono rounded panel-sharp bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none transition-colors ${
              error
                ? 'border-[var(--status-red)]'
                : activeAddress
                ? 'border-[var(--status-green)]'
                : 'border-[var(--border-color)] focus:border-[var(--accent-purple)]'
            }`}
            disabled={isLoading}
          />
          {address && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs font-mono px-2 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] transition-colors cursor-pointer"
              disabled={isLoading}
            >
              Clear
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3.5 text-sm font-display font-bold rounded bg-[var(--accent-purple)] hover:bg-[#B54CE6] text-white shadow-lg shadow-[var(--accent-purple-glow)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 min-w-[160px] cursor-pointer"
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
        <div className="px-4 py-2.5 rounded panel-sharp border-[var(--status-red)] bg-[var(--status-red-bg)] text-[var(--status-red)] text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <span className="font-bold">⚠️ Notice:</span>
          <span>{error}</span>
        </div>
      )}

      {/* Active Address Status Banner */}
      {activeAddress && !error && (
        <div className="px-4 py-3 rounded panel-sharp border-[var(--status-green)] bg-[var(--status-green-bg)] text-[var(--status-green)] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--status-green)] animate-pulse"></span>
            <span className="font-sans font-medium text-[var(--text-secondary)]">Active Address:</span>
            <span className="font-mono font-semibold text-[var(--text-primary)]">{activeAddress}</span>
          </div>
          <button
            onClick={handleClear}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] underline text-xs font-sans cursor-pointer"
          >
            Change Address
          </button>
        </div>
      )}
    </div>
  );
}
