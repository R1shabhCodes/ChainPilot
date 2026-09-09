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
      <div className="px-3 py-1.5 text-xs font-mono font-semibold rounded panel-sharp border-[var(--border-color)] text-[var(--text-muted)] flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-purple)]"></span>
        <span>Wallet Auth Ready</span>
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
      <div className="px-4 py-2 text-xs font-mono rounded panel-sharp border-[var(--border-color)] text-[var(--text-muted)] animate-pulse">
        Initializing Auth...
      </div>
    );
  }

  // Unauthenticated State
  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="px-4 py-2 text-xs font-display font-bold rounded bg-[var(--accent-orange)] hover:bg-[#E54E0E] text-white transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-[var(--accent-orange-glow)]"
      >
        <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
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
      <div className="px-3 py-1.5 rounded panel-sharp border-[var(--border-color)] text-xs font-mono text-[var(--status-green)] flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[var(--status-green)]"></span>
        <span>{displayName}</span>
      </div>
      <button
        onClick={handleLogout}
        className="px-3 py-1.5 text-xs font-sans font-semibold rounded bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] border border-[var(--border-color)] transition-colors cursor-pointer"
      >
        Log Out
      </button>
    </div>
  );
}
