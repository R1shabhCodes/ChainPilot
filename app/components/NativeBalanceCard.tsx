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
    <div className="w-full panel-sharp border-blue-top p-6 flex flex-col gap-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--status-green)] animate-pulse"></span>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Native On-Chain Balance
          </h3>
        </div>
        {data && (
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--accent-blue)] border border-[var(--border-color)]">
            Block #{data.blockNumber}
          </span>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
          <div className="h-6 w-6 rounded-full border-2 border-[var(--accent-blue-glow)] border-t-[var(--accent-blue)] animate-spin"></div>
          <span className="text-xs font-mono">Querying Live EVM RPC Node...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-3 rounded panel-sharp border-[var(--status-red)] bg-[var(--status-red-bg)] text-[var(--status-red)] text-xs font-mono flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            onClick={() => setData(null)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Verified Data State */}
      {data && !loading && !error && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Ethereum Native Balance
            </span>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display font-extrabold text-4xl sm:text-5xl text-[var(--text-primary)] tracking-tight">
                  {data.ethBalance}
                </span>
                <span className="font-mono font-bold text-[var(--accent-blue)] text-base">ETH</span>
              </div>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Via {data.rpcSource}
              </span>
            </div>
          </div>

          <div className="p-3 rounded panel-sharp bg-[var(--bg-surface-elevated)] text-xs font-mono flex flex-col gap-1.5 border-[var(--border-color)]">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Target Address:</span>
              <span className="text-[var(--text-primary)] font-semibold">
                {data.address.slice(0, 10)}...{data.address.slice(-8)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Raw Wei Quantity:</span>
              <span className="text-[var(--text-secondary)]">{data.weiBalance} Wei</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
