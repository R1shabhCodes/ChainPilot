'use client';

import { useState, useEffect } from 'react';

interface NativeBalanceData {
  address: string;
  ethBalance: string;
  weiBalance: string;
  blockNumber: number;
  fetchedAt: string;
  rpcSource: string;
}

interface NativeBalanceCardProps {
  address: string | null;
}

export default function NativeBalanceCard({ address }: NativeBalanceCardProps) {
  const [data, setData] = useState<NativeBalanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setData(null);
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(`/api/balance?address=${encodeURIComponent(address)}`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => Promise.reject(err.error || 'Failed to fetch balance'));
        }
        return res.json();
      })
      .then((result: NativeBalanceData) => {
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          setError(typeof err === 'string' ? err : 'Error connecting to EVM RPC node');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [address]);

  if (!address) {
    return null;
  }

  return (
    <div className="w-full bg-[var(--cp-surface)] border t-border p-5 font-mono flex flex-col gap-4 shadow-2xl animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b t-border pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-[#BAF24A] animate-pulse"></span>
          <h3 className="text-xs font-bold uppercase tracking-wider t-text">
            NATIVE ON-CHAIN TELEMETRY
          </h3>
        </div>
        {data && (
          <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--cp-surface-elevated)] text-cyan-500 border t-border">
            Block #{data.blockNumber}
          </span>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-6 flex flex-col items-center justify-center gap-2 t-text-muted">
          <div className="h-5 w-5 border-2 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
          <span className="text-xs font-mono">Querying Live EVM RPC Node...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            onClick={() => setData(null)}
            className="t-text-muted hover:t-text underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Verified Data State */}
      {data && !loading && !error && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold t-text-muted tracking-wider">
              NATIVE ETHEREUM BALANCE
            </span>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-4xl sm:text-5xl t-text-heading tracking-tight">
                  {data.ethBalance}
                </span>
                <span className="font-mono font-bold text-cyan-500 text-sm">ETH</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border text-xs font-mono flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="t-text-muted">Target Address:</span>
              <span className="t-text font-semibold">
                {data.address.slice(0, 8)}...{data.address.slice(-6)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="t-text-muted">RPC Source:</span>
              <span className="text-cyan-500 font-semibold">{data.rpcSource}</span>
            </div>
            <div className="flex justify-between border-t t-border pt-1.5 mt-0.5">
              <span className="t-text-muted">Raw Wei Quantity:</span>
              <span className="t-text-secondary text-[11px]">{data.weiBalance} Wei</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
