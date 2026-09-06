'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect } from 'react';

interface PrivyAuthButtonProps {
  onWalletSelect?: (address: string | null) => void;
}

export default function PrivyAuthButton({ onWalletSelect }: PrivyAuthButtonProps) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // Render a clean fallback indicator when NEXT_PUBLIC_PRIVY_APP_ID is unconfigured
  if (!privyAppId || privyAppId === 'placeholder-privy-app-id') {
    return (
      <div className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900/90 border border-slate-800 text-slate-400">
        Wallet Auth Ready
      </div>
    );
  }

  return <PrivyAuthButtonInner onWalletSelect={onWalletSelect} />;
}

function PrivyAuthButtonInner({ onWalletSelect }: PrivyAuthButtonProps) {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();

  // Resolve primary EVM wallet address or connected address
  const activeAddress = user?.wallet?.address || wallets[0]?.address || null;

  // Reactively inform parent coordinator when user authenticates or switches wallets
  useEffect(() => {
    if (ready && authenticated && activeAddress && onWalletSelect) {
      onWalletSelect(activeAddress);
    }
  }, [ready, authenticated, activeAddress, onWalletSelect]);

  const handleLogout = async () => {
    await logout();
    if (onWalletSelect) {
      onWalletSelect(null);
    }
  };

  // Render loading skeleton while Privy SDK initializes
  if (!ready) {
    return (
      <div className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-500 animate-pulse">
        Initializing Auth...
      </div>
    );
  }

  // Unauthenticated State
  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
      >
        <span className="h-2 w-2 rounded-full bg-cyan-200 animate-pulse"></span>
        Connect Wallet
      </button>
    );
  }

  // Authenticated State
  const displayName = activeAddress
    ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}`
    : user?.email?.address || 'Authenticated User';

  return (
    <div className="flex items-center gap-2">
      <div className="px-3 py-1.5 rounded-lg glass-panel bg-slate-900/90 border-slate-700/80 text-xs font-mono text-cyan-300 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
        <span>{displayName}</span>
      </div>
      <button
        onClick={handleLogout}
        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
      >
        Log Out
      </button>
    </div>
  );
}
