'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

type DisclosureLevel = 'BEGINNER' | 'ADVANCED' | 'PRO';

export default function LearnContent() {
  const [disclosureLevel, setDisclosureLevel] = useState<DisclosureLevel>('BEGINNER');
  const [simulatedRangeState, setSimulatedRangeState] = useState<'IN_RANGE' | 'OUT_BELOW' | 'OUT_ABOVE'>('IN_RANGE');

  return (
    <div className="min-h-screen flex flex-col t-bg t-text bg-dot-pattern selection:bg-[#00F0FF]/20 selection:text-[#00F0FF] transition-layout font-sans">
      {/* Top Header Navigation */}
      <header className="w-full border-b t-border-strong bg-[var(--cp-surface)]/95 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-[#00F0FF] group-hover:bg-[#baf24a] flex items-center justify-center font-black text-[#020306] text-sm panel-architecture transition-colors">
              CP
            </div>
            <div className="flex flex-col">
              <h1 className="font-display font-black text-lg leading-none tracking-tight flex items-center gap-2 uppercase t-text-heading">
                Chain<span className="text-[#00F0FF]">Pilot</span>
              </h1>
              <p className="text-[10px] font-mono t-text-muted uppercase tracking-widest mt-1">
                Educational Knowledge Base
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="px-4 py-2 bg-[var(--cp-surface-elevated)] hover:bg-[var(--cp-surface-highlight)] text-[#00F0FF] border border-[#00F0FF]/40 text-xs font-mono font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <span>← RETURN TO DASHBOARD</span>
          </Link>
        </div>
      </header>

      {/* Main Educational Hero & Navigation */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-12">
        
        {/* HERO HEADER */}
        <div className="w-full panel-architecture bg-[var(--cp-surface)] p-8 sm:p-12 border-l-4 border-l-[#00F0FF] flex flex-col gap-6 font-mono relative overflow-hidden">
          <div className="absolute top-4 right-4 text-[10px] t-text-muted border t-border px-2 py-1 uppercase tracking-widest hidden sm:block">
            DOCS // VERIFIED ON-CHAIN INTEL
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold uppercase tracking-widest w-fit">
            <span className="h-2 w-2 bg-[#00F0FF] animate-pulse"></span>
            HOW IT WORKS & EDUCATION GUIDE
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter uppercase t-text-heading leading-tight">
            UNDERSTAND YOUR <span className="text-[#00F0FF]">LIQUIDITY</span>.<br />
            MASTER YOUR <span className="text-[#ff5c16]">RANGE RISK</span>.
          </h1>

          <p className="text-sm sm:text-base font-sans t-text-secondary leading-relaxed max-w-3xl border-l-2 t-border-strong pl-4">
            ChainPilot translates complex on-chain Uniswap V3 math into plain-English risk assessments and dynamic decision support. Explore how verified Graph indexed data, deterministic range formulas, and schema-validated AI combine to keep you informed.
          </p>

          {/* Progressive Disclosure Selector */}
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 border-t t-border">
            <span className="text-xs t-text-muted uppercase tracking-widest font-bold">
              SELECT DETAIL LEVEL:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDisclosureLevel('BEGINNER')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors border cursor-pointer ${
                  disclosureLevel === 'BEGINNER'
                    ? 'bg-[#00F0FF] text-[#020306] border-[#00F0FF]'
                    : 'bg-[var(--cp-surface-elevated)] t-text-secondary border-t-border hover:t-text'
                }`}
              >
                1. BEGINNER (PLAIN ENGLISH)
              </button>
              <button
                onClick={() => setDisclosureLevel('ADVANCED')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors border cursor-pointer ${
                  disclosureLevel === 'ADVANCED'
                    ? 'bg-[#baf24a] text-[#020306] border-[#baf24a]'
                    : 'bg-[var(--cp-surface-elevated)] t-text-secondary border-t-border hover:t-text'
                }`}
              >
                2. ADVANCED (MATH & TICKS)
              </button>
              <button
                onClick={() => setDisclosureLevel('PRO')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors border cursor-pointer ${
                  disclosureLevel === 'PRO'
                    ? 'bg-[#ff5c16] text-[#020306] border-[#ff5c16]'
                    : 'bg-[var(--cp-surface-elevated)] t-text-secondary border-t-border hover:t-text'
                }`}
              >
                3. PRO / JUDGE (ARCHITECTURE)
              </button>
            </div>
          </div>
        </div>

        {/* ====================================================================
            SECTION 1: WHAT IS CHAINPILOT?
            ==================================================================== */}
        <section className="w-full panel-flat bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b t-border pb-3">
            <span className="text-xs px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
              01
            </span>
            <h2 className="text-lg font-black uppercase tracking-wider t-text-heading">
              WHAT IS CHAINPILOT?
            </h2>
          </div>

          <div className="font-sans t-text-secondary text-sm leading-relaxed space-y-4">
            <p>
              ChainPilot is an <strong>AI-assisted DeFi portfolio and risk copilot</strong> specifically built for <strong>Uniswap V3 concentrated liquidity positions</strong>.
            </p>
            <p>
              Unlike standard wallet trackers that only output total balance or arbitrary PnL, ChainPilot answers the core question:
            </p>
            <blockquote className="border-l-2 border-[#00F0FF] pl-4 italic t-text-heading font-mono text-xs sm:text-sm py-1 bg-[var(--cp-surface-elevated)]">
              &quot;Where is my liquidity active, has price drifted out of my target range, why does that matter for swap fee collection, and what should I consider doing next?&quot;
            </blockquote>
          </div>
        </section>

        {/* ====================================================================
            SECTION 2: PUBLIC WALLET ADDRESSES & READ-ONLY SAFETY
            ==================================================================== */}
        <section className="w-full panel-flat bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b t-border pb-3">
            <span className="text-xs px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
              02
            </span>
            <h2 className="text-lg font-black uppercase tracking-wider t-text-heading">
              WHAT WALLET ADDRESS SHOULD I ENTER?
            </h2>
          </div>

          <div className="font-sans t-text-secondary text-sm leading-relaxed space-y-4">
            <p>
              You can enter <strong>any valid public Ethereum wallet address</strong> (e.g. <code className="font-mono text-xs px-1.5 py-0.5 bg-[var(--cp-surface-elevated)] t-text">0x50ec05ade8280758e2077fcbc08d878d4aef79c3</code>).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
              <div className="p-4 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-2">
                <span className="text-[#baf24a] font-bold">✓ READ-ONLY & SAFE</span>
                <p className="font-sans t-text-muted text-xs">
                  Analyzing a public wallet requires zero transaction signing, zero wallet connections, and zero permissions. It operates 100% on public blockchain data.
                </p>
              </div>
              <div className="p-4 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-2">
                <span className="text-[#ff5c16] font-bold">✕ NO PRIVATE KEYS NEEDED</span>
                <p className="font-sans t-text-muted text-xs">
                  ChainPilot will <strong>never ask for seed phrases, private keys, or automated approval grants</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 3 & 4: UNISWAP V3 & CONCENTRATED LIQUIDITY
            ==================================================================== */}
        <section className="w-full panel-flat bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b t-border pb-3">
            <span className="text-xs px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
              03 & 04
            </span>
            <h2 className="text-lg font-black uppercase tracking-wider t-text-heading">
              UNISWAP V3 & CONCENTRATED LIQUIDITY
            </h2>
          </div>

          <div className="font-sans t-text-secondary text-sm leading-relaxed space-y-4">
            <p>
              In traditional <strong>Uniswap V2</strong>, liquidity was distributed across the entire price curve from zero to infinity (0 → ∞). While simple, it meant most capital sat idle and unused.
            </p>
            <p>
              <strong>Uniswap V3 introduced Concentrated Liquidity</strong>. LPs select a custom price interval [Lower Price, Upper Price]. Capital is utilized with up to 4000x higher efficiency, but introduces a new operational requirement: <strong>range monitoring</strong>.
            </p>
          </div>
        </section>

        {/* ====================================================================
            SECTION 5 & 6: TICKS & "OUT OF RANGE" EXPLANATION (INTERACTIVE DIAGRAM)
            ==================================================================== */}
        <section className="w-full panel-architecture bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-6 border-t-2 border-t-[#00F0FF]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b t-border pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
                05 & 06
              </span>
              <h2 className="text-lg font-black uppercase tracking-wider t-text-heading">
                INTERACTIVE RANGE DEMO: WHAT DOES &quot;OUT OF RANGE&quot; MEAN?
              </h2>
            </div>
            
            {/* Interactive Toggle for Simulator */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSimulatedRangeState('IN_RANGE')}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase border cursor-pointer ${
                  simulatedRangeState === 'IN_RANGE' ? 'bg-[#baf24a] text-[#020306] border-[#baf24a]' : 'bg-[var(--cp-surface-elevated)] t-text-muted border-t-border'
                }`}
              >
                IN RANGE
              </button>
              <button
                onClick={() => setSimulatedRangeState('OUT_BELOW')}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase border cursor-pointer ${
                  simulatedRangeState === 'OUT_BELOW' ? 'bg-[#ff5c16] text-[#020306] border-[#ff5c16]' : 'bg-[var(--cp-surface-elevated)] t-text-muted border-t-border'
                }`}
              >
                OUT (BELOW)
              </button>
              <button
                onClick={() => setSimulatedRangeState('OUT_ABOVE')}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase border cursor-pointer ${
                  simulatedRangeState === 'OUT_ABOVE' ? 'bg-[#ff5c16] text-[#020306] border-[#ff5c16]' : 'bg-[var(--cp-surface-elevated)] t-text-muted border-t-border'
                }`}
              >
                OUT (ABOVE)
              </button>
            </div>
          </div>

          {/* Visualizer Container */}
          <div className="p-6 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-6">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#00F0FF] font-bold">[ SIMULATED TICK DRIFT VISUALIZER ]</span>
              <span className="t-text-muted">TICK SPACING = 60 (0.3% FEE TIER)</span>
            </div>

            {/* Range Bar */}
            <div className="relative w-full h-12 bg-[var(--cp-surface)] border t-border flex items-center px-4 overflow-hidden">
              {/* Range Active Area */}
              <div className="absolute left-1/4 right-1/4 h-full bg-[#00F0FF]/15 border-x-2 border-[#00F0FF] flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#00F0FF] tracking-widest uppercase hidden sm:block">
                  SELECTED RANGE BOUNDARY
                </span>
              </div>

              {/* Simulated Current Tick Indicator */}
              <div
                className={`absolute h-full w-2 flex flex-col items-center justify-center transition-all duration-500 ${
                  simulatedRangeState === 'IN_RANGE'
                    ? 'left-1/2 bg-[#baf24a]'
                    : simulatedRangeState === 'OUT_BELOW'
                    ? 'left-[10%] bg-[#ff5c16]'
                    : 'left-[90%] bg-[#ff5c16]'
                }`}
              >
                <div className="absolute -top-7 px-2 py-0.5 text-[9px] font-bold text-[#020306] uppercase whitespace-nowrap shadow-md bg-white">
                  {simulatedRangeState === 'IN_RANGE' ? 'CURRENT TICK (ACTIVE)' : 'CURRENT TICK (INACTIVE)'}
                </div>
              </div>
            </div>

            {/* Context Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              <div className="p-3 bg-[var(--cp-surface)] border t-border">
                <span className="font-mono font-bold text-[#00F0FF] block mb-1">1. NOT LIQUIDATION</span>
                <p className="t-text-secondary text-xs">
                  Being out of range does <strong>NOT</strong> mean your funds are liquidated or lost. Your position remains intact on-chain as a Non-Fungible Token (NFT).
                </p>
              </div>
              <div className="p-3 bg-[var(--cp-surface)] border t-border">
                <span className="font-mono font-bold text-[#ff5c16] block mb-1">2. SINGLE-SIDED ASSETS</span>
                <p className="t-text-secondary text-xs">
                  When price moves out of range, 100% of your position is converted into whichever asset has dropped in relative value.
                </p>
              </div>
              <div className="p-3 bg-[var(--cp-surface)] border t-border">
                <span className="font-mono font-bold text-[#baf24a] block mb-1">3. ZERO FEE EARNINGS</span>
                <p className="t-text-secondary text-xs">
                  While out of range, your position is inactive and accumulates <strong>0 swap fees</strong> until price re-enters your specified bounds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 7 & 8: THE GRAPH & 5-STEP DATA ENGINE
            ==================================================================== */}
        <section className="w-full panel-flat bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b t-border pb-3">
            <span className="text-xs px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
              07 & 08
            </span>
            <h2 className="text-lg font-black uppercase tracking-wider t-text-heading">
              THE GRAPH: LOAD-BEARING ON-CHAIN DISCOVERY
            </h2>
          </div>

          <div className="font-sans t-text-secondary text-sm leading-relaxed space-y-4">
            <p>
              Why is <strong>The Graph</strong> essential for ChainPilot?
            </p>
            <p>
              Without an indexer like The Graph, discovering a wallet&apos;s Uniswap V3 positions would require crawling millions of raw Ethereum RPC event logs across contract history.
            </p>
          </div>

          {/* 5-Step Visual Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2 font-mono text-xs">
            <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-1">
              <span className="text-[#00F0FF] font-bold">STEP 1</span>
              <span className="t-text font-bold">PUBLIC WALLET</span>
              <span className="t-text-muted text-[10px] font-sans">0x Address input</span>
            </div>
            <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-1">
              <span className="text-[#00F0FF] font-bold">STEP 2</span>
              <span className="t-text font-bold">THE GRAPH</span>
              <span className="t-text-muted text-[10px] font-sans">GraphQL position indexer</span>
            </div>
            <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-1">
              <span className="text-[#baf24a] font-bold">STEP 3</span>
              <span className="t-text font-bold">DETERMINISTIC MATH</span>
              <span className="t-text-muted text-[10px] font-sans">Tick range math</span>
            </div>
            <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-1">
              <span className="text-[#d075ff] font-bold">STEP 4</span>
              <span className="t-text font-bold">AI INTERPRETATION</span>
              <span className="t-text-muted text-[10px] font-sans">Groq / Gemini reasoning</span>
            </div>
            <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-1">
              <span className="text-[#ff5c16] font-bold">STEP 5</span>
              <span className="t-text font-bold">DECISION SUPPORT</span>
              <span className="t-text-muted text-[10px] font-sans">Non-financial guidance</span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 9 & 10: PRIVY & READING WORKSPACE RESULTS
            ==================================================================== */}
        <section className="w-full panel-flat bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b t-border pb-3">
            <span className="text-xs px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
              09 & 10
            </span>
            <h2 className="text-lg font-black uppercase tracking-wider t-text-heading">
              PRIVY AUTH & WORKSPACE INTERPRETATION
            </h2>
          </div>

          <div className="font-sans t-text-secondary text-sm leading-relaxed space-y-4">
            <p>
              <strong>Privy Integration:</strong> Privy provides optional wallet connection infrastructure. It is <em>not required</em> for public wallet analysis, but enables user authentication for future action workflows.
            </p>
            <p>
              <strong>Reading Results:</strong> Every position highlights verified on-chain data, Etherscan contract provenance links, tick boundary distances, and structured AI evaluation.
            </p>
          </div>
        </section>

        {/* ====================================================================
            SECTION 11 & 12: DECISION SUPPORT & PROGRESSIVE DISCLOSURE MATRIX
            ==================================================================== */}
        <section className="w-full panel-flat bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b t-border pb-3">
            <span className="text-xs px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
              11 & 12
            </span>
            <h2 className="text-lg font-black uppercase tracking-wider t-text-heading">
              PROGRESSIVE DISCLOSURE MATRIX (BEGINNER → PRO)
            </h2>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border t-border border-collapse">
              <thead>
                <tr className="bg-[var(--cp-surface-elevated)] border-b t-border t-text-heading uppercase">
                  <th className="p-3 border-r t-border">FEATURE / CONCEPT</th>
                  <th className="p-3 border-r t-border text-[#00F0FF]">BEGINNER VIEW</th>
                  <th className="p-3 border-r t-border text-[#baf24a]">ADVANCED VIEW</th>
                  <th className="p-3 text-[#ff5c16]">PRO / JUDGE VIEW</th>
                </tr>
              </thead>
              <tbody className="divide-y t-border font-sans t-text-secondary">
                <tr>
                  <td className="p-3 font-mono font-bold t-text border-r t-border">Position Range State</td>
                  <td className="p-3 border-r t-border">&quot;Your position is currently active and earning fees.&quot;</td>
                  <td className="p-3 border-r t-border">Current tick: 204,500; Lower: 200,000; Upper: 210,000</td>
                  <td className="p-3">Tick distance ratio: 45% centered; relative range width: 10,000 ticks</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold t-text border-r t-border">Out of Range Status</td>
                  <td className="p-3 border-r t-border">&quot;Position is inactive. Fees paused until price returns.&quot;</td>
                  <td className="p-3 border-r t-border">Drifted 4,500 ticks below lower bound (t_current &lt; t_lower)</td>
                  <td className="p-3">Single-sided WETH exposure; 0 swap fee accrual state</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold t-text border-r t-border">Data Provenance</td>
                  <td className="p-3 border-r t-border">Verified from Ethereum Mainnet</td>
                  <td className="p-3 border-r t-border">Direct Etherscan links to wallet & NFT token ID</td>
                  <td className="p-3">The Graph Subgraph Gateway query + NonfungiblePositionManager contract</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold t-text border-r t-border">Decision Support</td>
                  <td className="p-3 border-r t-border">&quot;Consider reviewing if target range matches current market.&quot;</td>
                  <td className="p-3 border-r t-border">Evaluate re-centering bounds or harvesting accrued rewards</td>
                  <td className="p-3">Deterministic rule-based decision matrix (Lower/Upper range ratio)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <div className="w-full panel-architecture bg-[var(--cp-surface)] p-8 border-t-2 border-t-[#00F0FF] flex flex-col sm:flex-row items-center justify-between gap-6 font-mono">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className="text-base font-black uppercase t-text-heading">READY TO ANALYZE A WALLET?</span>
            <span className="text-xs t-text-muted font-sans">Inspect verified Uniswap V3 liquidity positions in seconds.</span>
          </div>
          <Link
            href="/"
            className="px-6 py-3 bg-[#00F0FF] hover:bg-[#baf24a] text-[#020306] font-mono font-black text-xs uppercase tracking-widest transition-colors panel-flat flex items-center gap-2"
          >
            <span>LAUNCH CHAINPILOT DASHBOARD →</span>
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t t-border-strong bg-[var(--cp-surface)] py-6 px-6 font-mono text-xs text-center t-text-muted">
        CHAINPILOT DEFI RISK INTEL // THE GRAPH & UNISWAP V3 POWERED // READ-ONLY SAFETY
      </footer>
    </div>
  );
}
