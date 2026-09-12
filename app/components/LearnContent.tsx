'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LiquidityRangeVisualizer from './LiquidityRangeVisualizer';

type DisclosureLevel = 'BEGINNER' | 'ADVANCED' | 'PRO';

export default function LearnContent() {
  const [disclosureLevel, setDisclosureLevel] = useState<DisclosureLevel>('BEGINNER');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLevelSelect = (level: DisclosureLevel, targetId: string) => {
    setDisclosureLevel(level);
    scrollToSection(targetId);
  };

  return (
    <div className="min-h-screen flex flex-col t-bg t-text bg-dot-pattern selection:bg-[#00F0FF]/20 selection:text-[#00F0FF] transition-layout font-sans">
      {/* Top Header Navigation */}
      <header className="w-full border-b t-border-strong bg-[var(--cp-surface)]/95 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group" title="Return to ChainPilot Landing Page">
            <div className="h-10 w-10 bg-[#00F0FF] group-hover:bg-[#baf24a] flex items-center justify-center font-black text-slate-950 text-sm panel-architecture transition-colors shadow-md">
              CP
            </div>
            <div className="flex flex-col">
              <h1 className="font-display font-black text-lg leading-none tracking-tight flex items-center gap-2 uppercase t-text-heading group-hover:text-cyan-400 transition-colors">
                Chain<span className="text-[#00F0FF]">Pilot</span>
              </h1>
              <p className="text-[10px] font-mono t-text-muted uppercase tracking-widest mt-1">
                Architecture & Risk Presentation
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
            <span>← LAUNCH WORKSPACE</span>
          </Link>
        </div>
      </header>

      {/* Main Presentation Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-12">
        
        {/* SECTION 1: HERO */}
        <div className="w-full panel-architecture bg-[var(--cp-surface)] p-8 sm:p-12 border-l-4 border-l-[#00F0FF] flex flex-col gap-6 font-mono relative overflow-hidden shadow-2xl">
          <div className="absolute top-4 right-4 text-[10px] t-text-muted border t-border px-2 py-1 uppercase tracking-widest hidden sm:block">
            IN-PRODUCT DEMO PRESENTATION
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold uppercase tracking-widest w-fit">
            <span className="h-2 w-2 bg-[#00F0FF] animate-pulse"></span>
            HOW CHAINPILOT WORKS
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter uppercase t-text-heading leading-tight">
            FROM VERIFIED ON-CHAIN DATA<br />
            TO <span className="text-[#00F0FF]">UNDERSTANDABLE RISK</span> —<br />
            WITHOUT GIVING CONTROL TO THE AI.
          </h1>

          <p className="text-sm sm:text-base font-sans t-text-secondary leading-relaxed max-w-3xl border-l-2 t-border-strong pl-4">
            ChainPilot is an AI-assisted Uniswap V3 risk copilot. It queries indexed position data through The Graph, evaluates tick boundaries deterministically, and provides grounded AI risk interpretations with full on-chain provenance.
          </p>

          {/* Interactive Detail Level Switcher */}
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 border-t t-border">
            <span className="text-xs t-text-muted uppercase tracking-widest font-bold">
              DETAIL LEVEL CONTROL:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleLevelSelect('BEGINNER', 'beginner-section')}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors border cursor-pointer ${
                  disclosureLevel === 'BEGINNER'
                    ? 'bg-[#00F0FF] text-slate-950 border-[#00F0FF] shadow-md font-black'
                    : 'bg-[var(--cp-surface-elevated)] t-text-secondary border-t-border hover:t-text'
                }`}
              >
                1. BEGINNER (PLAIN ENGLISH)
              </button>
              <button
                onClick={() => handleLevelSelect('ADVANCED', 'advanced-section')}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors border cursor-pointer ${
                  disclosureLevel === 'ADVANCED'
                    ? 'bg-[#baf24a] text-slate-950 border-[#baf24a] shadow-md font-black'
                    : 'bg-[var(--cp-surface-elevated)] t-text-secondary border-t-border hover:t-text'
                }`}
              >
                2. ADVANCED (MATH & TICKS)
              </button>
              <button
                onClick={() => handleLevelSelect('PRO', 'pro-section')}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors border cursor-pointer ${
                  disclosureLevel === 'PRO'
                    ? 'bg-[#ff5c16] text-slate-950 border-[#ff5c16] shadow-md font-black'
                    : 'bg-[var(--cp-surface-elevated)] t-text-secondary border-t-border hover:t-text'
                }`}
              >
                3. PRO / JUDGE (ARCHITECTURE)
              </button>
            </div>
          </div>
        </div>

        {/* DYNAMIC DISCLOSURE HIGHLIGHT BANNER */}
        <div className="w-full panel-flat bg-[var(--cp-surface-elevated)] p-4 border-l-4 border-l-cyan-500 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-cyan-500 animate-pulse"></span>
            <span className="font-bold t-text uppercase tracking-wider">ACTIVE PERSPECTIVE:</span>
            <span className="font-black text-cyan-400 uppercase tracking-widest">{disclosureLevel} MODE</span>
          </div>
          <p className="font-sans t-text-secondary text-xs">
            {disclosureLevel === 'BEGINNER' && 'Focused on core concepts, range status, and plain-English risk understanding.'}
            {disclosureLevel === 'ADVANCED' && 'Focused on tick boundaries, range geometry ratios, fee collection, and math.'}
            {disclosureLevel === 'PRO' && 'Focused on system architecture, data provenance, provider resilience, and safety boundaries.'}
          </p>
        </div>

        {/* SECTION 2: WHAT IS CHAINPILOT? */}
        <section id="beginner-section" className="w-full panel-flat bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-4">
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
              Unlike generic wallet trackers that only show raw balances, ChainPilot answers the load-bearing operational question:
            </p>
            <blockquote className="border-l-2 border-[#00F0FF] pl-4 italic t-text-heading font-mono text-xs sm:text-sm py-2 bg-[var(--cp-surface-elevated)]">
              &quot;Is my liquidity actively earning fees, how far has price drifted from my selected range, what are the risk implications, and what non-prescriptive options should I consider?&quot;
            </blockquote>
          </div>
        </section>

        {/* SECTION 3: THE USER PROBLEM */}
        <section className="w-full panel-flat bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b t-border pb-3">
            <span className="text-xs px-2 py-0.5 bg-[#ff5c16]/10 text-[#ff5c16] border border-[#ff5c16]/30 font-bold">
              02
            </span>
            <h2 className="text-lg font-black uppercase tracking-wider t-text-heading">
              THE USER PROBLEM: HIDDEN RANGE RISK
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-sm leading-relaxed">
            <div className="p-4 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-2">
              <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-wider">
                ✕ TRADITIONAL WALLET DISPLAY
              </span>
              <p className="t-text-secondary text-xs">
                Shows a static token balance or NFT card. Does not alert the user when the pool tick drifts past boundary limits or when fee accrual stops completely.
              </p>
            </div>
            <div className="p-4 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-2">
              <span className="font-mono text-xs font-bold text-[#baf24a] uppercase tracking-wider">
                ✓ CHAINPILOT RANGE DIAGNOSIS
              </span>
              <p className="t-text-secondary text-xs">
                Continuously measures current pool tick vs position lower/upper tick boundaries, computing exact tick distances, exposure shifts, and fee activity.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: ARCHITECTURE PIPELINE */}
        <section id="pro-section" className="w-full panel-architecture bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-6 border-t-2 border-t-[#00F0FF]">
          <div className="flex items-center gap-3 border-b t-border pb-3">
            <span className="text-xs px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
              03 & 04
            </span>
            <h2 className="text-lg font-black uppercase tracking-wider t-text-heading">
              NON-NEGOTIABLE ARCHITECTURE PIPELINE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider">
            <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border text-cyan-400">PUBLIC WALLET</div>
            <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border text-cyan-400">THE GRAPH</div>
            <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border text-[#baf24a]">VERIFIED DATA</div>
            <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border text-[#baf24a]">DETERMINISTIC ENGINE</div>
            <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border text-purple-400">AI EXPLANATION</div>
            <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border text-amber-400">DECISION SUPPORT</div>
            <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border text-cyan-400">USER DECIDES</div>
          </div>

          <div className="p-4 bg-[var(--cp-surface-elevated)] border t-border text-xs font-sans t-text-secondary leading-relaxed space-y-2">
            <p>
              <strong>Data Provenance Guarantee:</strong> The Graph is the load-bearing source of verified indexed position data. Deterministic range geometry computes exact boundaries. AI provides natural-language interpretation only. Final control rests 100% with the user.
            </p>
          </div>
        </section>

        {/* SECTION 5: TECHNOLOGY MAPPING */}
        <section className="w-full panel-flat bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b t-border pb-3">
            <span className="text-xs px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
              05
            </span>
            <h2 className="text-lg font-black uppercase tracking-wider t-text-heading">
              TECHNOLOGY MAPPING
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono">
            <div className="p-4 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-1.5">
              <span className="text-[#00F0FF] font-black uppercase">FRONTEND</span>
              <span className="t-text font-bold text-xs">Next.js 16 (App Router)</span>
              <span className="t-text-muted text-[10px] font-sans">React 19, TypeScript, Vanilla CSS Tokens</span>
            </div>

            <div className="p-4 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-1.5">
              <span className="text-[#00F0FF] font-black uppercase">INDEXED DATA</span>
              <span className="t-text font-bold text-xs">The Graph Subgraph</span>
              <span className="t-text-muted text-[10px] font-sans">Uniswap V3 Decentralized Subgraph Gateway</span>
            </div>

            <div className="p-4 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-1.5">
              <span className="text-purple-400 font-black uppercase">AI RESILIENCE</span>
              <span className="t-text font-bold text-xs">Groq → Gemini → Fallback</span>
              <span className="t-text-muted text-[10px] font-sans">Structured JSON output with evidence citations</span>
            </div>

            <div className="p-4 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-1.5">
              <span className="text-[#baf24a] font-black uppercase">WALLET / AUTH</span>
              <span className="t-text font-bold text-xs">Privy Auth (Optional)</span>
              <span className="t-text-muted text-[10px] font-sans">Read-only analysis requires zero wallet connections</span>
            </div>

            <div className="p-4 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-1.5">
              <span className="text-[#ff5c16] font-black uppercase">PROVENANCE</span>
              <span className="t-text font-bold text-xs">Etherscan & Uniswap</span>
              <span className="t-text-muted text-[10px] font-sans">Direct read-only protocol links to contracts & NFTs</span>
            </div>
          </div>
        </section>

        {/* SECTION 6: VERIFIED DATA VS DETERMINISTIC ENGINE VS AI */}
        <section id="advanced-section" className="w-full panel-flat bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b t-border pb-3">
            <span className="text-xs px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
              06
            </span>
            <h2 className="text-lg font-black uppercase tracking-wider t-text-heading">
              DETERMINISTIC ENGINE VS AI EXPLANATION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-4 bg-[var(--cp-surface-elevated)] border border-cyan-500/40 flex flex-col gap-3">
              <span className="font-black text-cyan-400 uppercase">LAYER 1: VERIFIED DATA</span>
              <ul className="space-y-1 font-sans t-text-secondary text-xs">
                <li>• Pool address & token pair symbols</li>
                <li>• Lower tick bound (t_lower)</li>
                <li>• Upper tick bound (t_upper)</li>
                <li>• Live current pool tick (t_current)</li>
              </ul>
            </div>

            <div className="p-4 bg-[var(--cp-surface-elevated)] border border-[#baf24a]/40 flex flex-col gap-3">
              <span className="font-black text-[#baf24a] uppercase">LAYER 2: DETERMINISTIC ENGINE</span>
              <ul className="space-y-1 font-sans t-text-secondary text-xs">
                <li>• In-range vs out-of-range status</li>
                <li>• Exact tick distances to bounds</li>
                <li>• Range ratio & protocol tick spacing</li>
                <li>• Rule-based consideration generator</li>
              </ul>
            </div>

            <div className="p-4 bg-[var(--cp-surface-elevated)] border border-purple-500/40 flex flex-col gap-3">
              <span className="font-black text-purple-400 uppercase">LAYER 3: AI INTERPRETATION</span>
              <ul className="space-y-1 font-sans t-text-secondary text-xs">
                <li>• Natural-language summary</li>
                <li>• What I Found / Why It Matters</li>
                <li>• Grounded strictly in Layer 1 & 2 facts</li>
                <li>• Structured schema output validation</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 7 & 8: WHY THE GRAPH? & UNISWAP V3 RANGE RISK */}
        <section className="w-full panel-flat bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b t-border pb-3">
            <span className="text-xs px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
              07 & 08
            </span>
            <h2 className="text-lg font-black uppercase tracking-wider t-text-heading">
              WHY THE GRAPH & WHY RANGE RISK MATTERS
            </h2>
          </div>

          <div className="font-sans t-text-secondary text-sm leading-relaxed space-y-3">
            <p>
              <strong>Why The Graph?</strong> Indexing Uniswap V3 positions directly via standard RPC would require scanning millions of historical mint and burn event logs. The Graph Subgraph Gateway provides instant, verified GraphQL queries for any wallet address.
            </p>
            <p>
              <strong>Out of Range ≠ Liquidation:</strong> When a position moves out of range, liquidity is inactive and accumulates 0 swap fees. However, assets are not liquidated; the position remains fully owned on-chain as a Non-Fungible Token.
            </p>
          </div>
        </section>

        {/* SECTION 9: TICK DRIFT SIMULATOR */}
        <section className="w-full panel-architecture bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-6 border-t-2 border-t-amber-400">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b t-border pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-500 border border-amber-500/40 font-bold">
                09
              </span>
              <h2 className="text-lg font-black uppercase tracking-wider t-text-heading">
                INTERACTIVE TICK DRIFT SIMULATOR
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
              SIMULATION — NOT LIVE DATA
            </span>
          </div>

          <p className="text-xs font-sans t-text-secondary leading-relaxed">
            Test how tick drift affects range status and distance math. This local instrument alters visual telemetry without modifying blockchain state.
          </p>

          <LiquidityRangeVisualizer
            tickLower={194000}
            tickUpper={214000}
            currentTick={205000}
            rangeStatus="IN_RANGE"
          />
        </section>

        {/* SECTION 10 & 11: PROVENANCE AUDIT & READ-ONLY SAFETY */}
        <section className="w-full panel-flat bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b t-border pb-3">
            <span className="text-xs px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
              10 & 11
            </span>
            <h2 className="text-lg font-black uppercase tracking-wider t-text-heading">
              PROVENANCE & READ-ONLY SAFETY BOUNDARIES
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-2">
              <span className="text-[#00F0FF] font-bold">VERIFIABLE PROVENANCE</span>
              <p className="font-sans t-text-muted text-xs">
                Every position detail contains direct Etherscan links to NFT ID, Pool Contract, Factory Contract, and Subgraph Deployment ID. Don&apos;t trust — verify.
              </p>
            </div>
            <div className="p-4 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-2">
              <span className="text-[#baf24a] font-bold">READ-ONLY SAFETY</span>
              <p className="font-sans t-text-muted text-xs">
                Public wallet analysis requires zero private keys, zero signature grants, and zero autonomous execution.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 12: PROGRESSIVE DISCLOSURE MATRIX */}
        <section className="w-full panel-flat bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b t-border pb-3">
            <span className="text-xs px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-bold">
              12
            </span>
            <h2 className="text-lg font-black uppercase tracking-wider t-text-heading">
              PROGRESSIVE DISCLOSURE MATRIX
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border t-border border-collapse">
              <thead>
                <tr className="bg-[var(--cp-surface-elevated)] border-b t-border t-text-heading uppercase">
                  <th className="p-3 border-r t-border">CONCEPT</th>
                  <th className="p-3 border-r t-border text-[#00F0FF]">BEGINNER VIEW</th>
                  <th className="p-3 border-r t-border text-[#baf24a]">ADVANCED VIEW</th>
                  <th className="p-3 text-[#ff5c16]">PRO / JUDGE VIEW</th>
                </tr>
              </thead>
              <tbody className="divide-y t-border font-sans t-text-secondary">
                <tr>
                  <td className="p-3 font-mono font-bold t-text border-r t-border">Range Status</td>
                  <td className="p-3 border-r t-border">&quot;Active and earning swap fees.&quot;</td>
                  <td className="p-3 border-r t-border">t_current inside [t_lower, t_upper]</td>
                  <td className="p-3">Verified Graph payload; distance ratio 45%</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold t-text border-r t-border">Out of Range</td>
                  <td className="p-3 border-r t-border">&quot;Inactive. Fees paused.&quot;</td>
                  <td className="p-3 border-r t-border">Drifted 4,500 ticks below t_lower</td>
                  <td className="p-3">Single-sided asset risk state</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold t-text border-r t-border">AI Engine</td>
                  <td className="p-3 border-r t-border">Plain-English risk explanation</td>
                  <td className="p-3 border-r t-border">Grounded evidence citations</td>
                  <td className="p-3">Groq primary → Gemini fallback → Deterministic fallback</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 13: FUTURE / ROADMAP */}
        <section className="w-full panel-flat bg-[var(--cp-surface)] p-6 sm:p-8 font-mono flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b t-border pb-3">
            <span className="text-xs px-2 py-0.5 bg-[#baf24a]/20 text-[#baf24a] border border-[#baf24a]/40 font-bold">
              13
            </span>
            <h2 className="text-lg font-black uppercase tracking-wider t-text-heading">
              FUTURE / ROADMAP
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-1">
              <span className="text-[#00F0FF] font-bold">[PHASE 2] HISTORICAL DRIFT</span>
              <p className="font-sans t-text-muted text-[11px]">Historical tick volatility analytics and time-in-range tracking.</p>
            </div>
            <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-1">
              <span className="text-[#baf24a] font-bold">[PHASE 3] USER ACTION SIGNING</span>
              <p className="font-sans t-text-muted text-[11px]">Optional user-approved transaction workflows via Privy embedded wallet.</p>
            </div>
            <div className="p-3 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-1">
              <span className="text-[#ff5c16] font-bold">[PHASE 4] MULTI-CHAIN EXPANSION</span>
              <p className="font-sans t-text-muted text-[11px]">Arbitrum, Optimism, and Polygon Uniswap V3 Subgraph deployment indexing.</p>
            </div>
          </div>
        </section>

        {/* SECTION 14: LAUNCH DASHBOARD CTA */}
        <div className="w-full panel-architecture bg-[var(--cp-surface)] p-8 border-t-2 border-t-[#00F0FF] flex flex-col sm:flex-row items-center justify-between gap-6 font-mono shadow-2xl">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className="text-lg font-black uppercase t-text-heading">SEE THE RANGE. KNOW THE RISK.</span>
            <span className="text-xs t-text-muted font-sans">Launch the ChainPilot dashboard to inspect any public Ethereum wallet.</span>
          </div>
          <Link
            href="/"
            className="px-6 py-3.5 bg-[#00F0FF] hover:bg-[#baf24a] text-slate-950 font-mono font-black text-xs uppercase tracking-widest transition-colors flex items-center gap-2 shadow-lg cursor-pointer border border-[#00F0FF]"
          >
            <span className="text-slate-950 font-black">LAUNCH THE DASHBOARD →</span>
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t t-border-strong bg-[var(--cp-surface)] py-6 px-6 font-mono text-xs text-center t-text-muted">
        CHAINPILOT DEFI RISK INTEL // THE GRAPH SUBGRAPH & UNISWAP V3 POWERED // READ-ONLY SAFETY
      </footer>
    </div>
  );
}
