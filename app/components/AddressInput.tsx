'use client';

import React, { useState, useEffect } from 'react';

interface AddressInputProps {
  externalAddress?: string | null;
  onAnalyze?: (address: string) => void;
}

const SAMPLE_ADDRESSES = [
  { label: 'Uniswap V3 LP (Mainnet)', address: '0x50EC05A6E8280758E2077fcBC08D878d4aEf79C3' },
  { label: 'Zero Positions Test', address: '0x0000000000000000000000000000000000000000' },
];

export default function AddressInput({ externalAddress, onAnalyze }: AddressInputProps) {
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeAddress, setActiveAddress] = useState<string | null>(null);

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

    setTimeout(() => {
      setIsLoading(false);
      setActiveAddress(cleanAddress);
      if (onAnalyze) {
        onAnalyze(cleanAddress);
      }
    }, 300);
  };

  const handleSelectSample = (sampleAddr: string) => {
    setAddress(sampleAddr);
    setError(null);
    setActiveAddress(sampleAddr);
    if (onAnalyze) {
      onAnalyze(sampleAddr);
    }
  };

  const handleClear = () => {
    setAddress('');
    setError(null);
    setIsLoading(false);
    setActiveAddress(null);
  };

  return (
    <div className="w-full flex flex-col gap-3 font-mono">
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00F0FF] font-bold text-xs pointer-events-none select-none">
            0x
          </div>
          <input
            type="text"
            value={address.startsWith('0x') ? address.slice(2) : address}
            onChange={(e) => {
              const val = e.target.value;
              setAddress(val.startsWith('0x') ? val : `0x${val}`);
              if (error) setError(null);
            }}
            placeholder="Enter EVM Wallet Address (0x...)"
            className={`w-full pl-9 pr-16 py-3 text-xs font-mono bg-[#07090e] text-slate-100 placeholder-slate-400 border transition-all focus:outline-none ${
              error
                ? 'border-red-500/80 focus:border-red-500'
                : activeAddress
                ? 'border-[#BAF24A]/60 focus:border-[#BAF24A]'
                : 'border-slate-800 focus:border-[#00F0FF]'
            }`}
            disabled={isLoading}
          />
          {address && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-[10px] uppercase font-bold px-1.5 py-0.5 bg-slate-900 border border-slate-700 cursor-pointer"
              disabled={isLoading}
            >
              Clear
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 text-xs font-bold uppercase tracking-wider bg-[#00F0FF] hover:bg-[#33F3FF] text-slate-950 border border-[#00F0FF] shadow-lg shadow-[#00F0FF]/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-w-[170px]"
        >
          {isLoading ? (
            <>
              <span className="h-3.5 w-3.5 border-2 border-slate-950/40 border-t-slate-950 animate-spin"></span>
              QUERYING...
            </>
          ) : (
            'ANALYZE PORTFOLIO'
          )}
        </button>
      </form>

      {/* Validation Error Alert */}
      {error && (
        <div className="px-3 py-2 bg-red-950/60 border border-red-800 text-red-300 text-[11px] font-mono flex items-center gap-2">
          <span className="font-bold">⚠️ NOTICE:</span>
          <span>{error}</span>
        </div>
      )}

      {/* Quick Sample Address Selector Bar */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 select-none">
        <span className="uppercase font-semibold tracking-wider text-slate-400">Sample Addresses:</span>
        {SAMPLE_ADDRESSES.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectSample(sample.address)}
            className={`px-2.5 py-1 bg-slate-950 border text-[10px] font-mono transition-colors cursor-pointer ${
              activeAddress?.toLowerCase() === sample.address.toLowerCase()
                ? 'border-[#BAF24A] text-[#BAF24A] font-bold'
                : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
}
