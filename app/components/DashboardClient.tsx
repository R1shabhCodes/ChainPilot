'use client';

import { useState } from 'react';
import PrivyAuthButton from './PrivyAuthButton';
import AddressInput from './AddressInput';
import NativeBalanceCard from './NativeBalanceCard';

export default function DashboardClient() {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header Navigation */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
            CP
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none tracking-tight">
              Chain<span className="gradient-text">Pilot</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">DeFi Risk & Portfolio Copilot</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            ETHOnline 2026
          </span>
          <PrivyAuthButton onWalletSelect={(address) => setSelectedAddress(address)} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Hero Section */}
        <section className="text-center max-w-2xl mx-auto flex flex-col items-center gap-4 py-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Turn On-Chain Complexity Into <br />
            <span className="gradient-text">Evidence-Backed Insights</span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Enter an EVM wallet address or connect your wallet to query indexed live protocol data via 
            The Graph, receive transparent AI risk analysis, and review suggested actions.
          </p>

          {/* Reusable Address Input */}
          <div className="w-full mt-2">
            <AddressInput
              externalAddress={selectedAddress}
              onAnalyze={(address) => setSelectedAddress(address)}
            />
          </div>
        </section>

        {/* Live Native On-Chain RPC Balance Section */}
        {selectedAddress && (
          <section className="max-w-2xl w-full mx-auto">
            <NativeBalanceCard address={selectedAddress} />
          </section>
        )}

        {/* Feature Grid Placeholders */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Subgraph Data */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col gap-3">
            <div className="h-10 w-10 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 flex items-center justify-center font-semibold text-sm">
              01
            </div>
            <h3 className="font-bold text-base text-slate-100">Indexed On-Chain Data</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Queries real-time positions, liquidity mints/burns, and health metrics directly from 
              The Graph network subgraphs.
            </p>
            <div className="mt-auto pt-4 border-t border-slate-800/60 text-xs font-mono text-cyan-400/90 flex items-center justify-between">
              <span>The Graph Integration</span>
              <span>Phase 3</span>
            </div>
          </div>

          {/* Card 2: AI Reasoning */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 flex items-center justify-center font-semibold text-sm">
              02
            </div>
            <h3 className="font-bold text-base text-slate-100">Evidence-Backed AI Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Processes raw subgraph data to produce risk evaluations, position alerts, and 
              verifiable on-chain evidence citations.
            </p>
            <div className="mt-auto pt-4 border-t border-slate-800/60 text-xs font-mono text-indigo-400/90 flex items-center justify-between">
              <span>AI Engine</span>
              <span>Phase 4</span>
            </div>
          </div>

          {/* Card 3: Execution Flow */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center font-semibold text-sm">
              03
            </div>
            <h3 className="font-bold text-base text-slate-100">User-Approved Execution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prepares transparent transaction options for user sign-off via Privy embedded 
              wallets with zero automatic actions.
            </p>
            <div className="mt-auto pt-4 border-t border-slate-800/60 text-xs font-mono text-emerald-400/90 flex items-center justify-between">
              <span>Privy Flow</span>
              <span>Phase 6</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 px-6 text-center text-xs text-slate-500">
        <p>ChainPilot — Built for ETHOnline 2026. Evidence-backed copilot, non-custodial and transparent.</p>
      </footer>
    </div>
  );
}
