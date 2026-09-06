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
    <div className="w-full glass-panel rounded-2xl p-6 border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-4 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Native On-Chain Balance
          </h3>
        </div>
        {data && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-cyan-400 border border-cyan-800/40">
            Block #{data.blockNumber}
          </span>
        )}
      </div>

      {loading && (
        <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-400">
          <div className="h-6 w-6 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
          <span className="text-xs font-medium">Querying EVM RPC Node...</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/50 text-red-300 text-xs flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            onClick={() => setData(null)}
            className="text-slate-400 hover:text-slate-200 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {data && !loading && !error && (
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-100 tracking-tight">
                {data.ethBalance}
              </span>
              <span className="text-sm font-bold text-cyan-400">ETH</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Via {data.rpcSource}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/50 flex flex-col gap-1 text-[11px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Target Address:</span>
              <span className="text-slate-200">{data.address.slice(0, 10)}...{data.address.slice(-8)}</span>
            </div>
            <div className="flex justify-between">
              <span>Raw Wei Quantity:</span>
              <span className="text-slate-300">{data.weiBalance} Wei</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
