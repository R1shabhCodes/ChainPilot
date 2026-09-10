'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import AddressInput from './AddressInput';
import ChainPilotCompass from './ChainPilotCompass';
import LiquidityRangeVisualizer from './LiquidityRangeVisualizer';

interface LandingPageProps {
  onAnalyze: (address: string) => void;
}

export default function LandingPage({ onAnalyze }: LandingPageProps) {
  const ctaRef = useRef<HTMLDivElement>(null);

  const scrollToCta = () => {
    ctaRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col">

      {/* ================================================================
          SECTION 1 — HERO
          ================================================================ */}
      <section className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 py-12 lg:py-20 min-h-[90vh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">

          {/* Background Architectural Lines */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <div className="absolute top-0 left-1/4 w-px h-full bg-cyan-500/30"></div>
            <div className="absolute top-1/3 left-0 w-full h-px bg-cyan-500/30"></div>
          </div>

          {/* Left: Headline + Input */}
          <div className="lg:col-span-7 flex flex-col gap-8 z-10">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 panel-flat text-[10px] font-mono text-cyan-500 w-fit font-bold tracking-widest uppercase">
              <span className="h-1.5 w-1.5 bg-cyan-500"></span>
              Verified On-Chain DeFi Intelligence
            </div>

            <div className="flex flex-col">
              <h2 className="text-6xl sm:text-[80px] md:text-[100px] font-display font-black tracking-tighter leading-[0.85] uppercase text-stroke-cyan">
                SEE THE
              </h2>
              <h2 className="text-6xl sm:text-[80px] md:text-[100px] font-display font-black tracking-tighter leading-[0.85] uppercase text-[#baf24a] -ml-2">
                RANGE.
              </h2>
              <h2 className="text-6xl sm:text-[80px] md:text-[100px] font-display font-black tracking-tighter leading-[0.85] uppercase t-text-heading mt-4">
                KNOW THE
              </h2>
              <h2 className="text-6xl sm:text-[80px] md:text-[100px] font-display font-black tracking-tighter leading-[0.85] uppercase text-[#ff5c16] -ml-2">
                RISK.
              </h2>
            </div>

            <p className="text-base t-text-secondary leading-relaxed max-w-lg font-sans border-l-2 t-border-strong pl-4">
              An AI-powered copilot that analyzes DeFi liquidity positions
              and helps you understand on-chain risk — with verified data from The Graph
              and transparent Gemini AI evaluations.
            </p>

            {/* Wallet Command Bar */}
            <div className="w-full max-w-xl pt-2">
              <div className="panel-architecture bg-[var(--cp-surface-elevated)] p-1.5">
                <AddressInput
                  externalAddress={null}
                  onAnalyze={onAnalyze}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-[10px] font-mono t-text-muted font-bold uppercase tracking-widest">
                <div className="flex items-center gap-3">
                  <span>[ LIVE ETHEREUM DATA ]</span>
                  <span>[ UNISWAP V3 ]</span>
                  <span>[ AI RISK ANALYSIS ]</span>
                </div>
                <Link
                  href="/learn"
                  className="text-[#00F0FF] hover:text-[#baf24a] hover:underline transition-colors flex items-center gap-1 font-bold"
                >
                  HOW IT WORKS & LEARN →
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Compass */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-[520px] mx-auto pointer-events-none opacity-90">
              <ChainPilotCompass />
            </div>
          </div>
        </div>
      </section>


      {/* ================================================================
          SECTION 2 — THE PROBLEM
          ================================================================ */}
      <section className="w-full border-t t-border-strong bg-[var(--cp-surface)]">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-20 lg:py-28 flex flex-col gap-16">

          <div className="max-w-3xl">
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tighter leading-[0.9] uppercase t-text-heading">
              YOUR WALLET BALANCE<br />
              <span className="text-stroke-cyan">DOESN&apos;T TELL THE</span><br />
              <span className="text-[#ff5c16]">WHOLE STORY.</span>
            </h3>
            <p className="mt-8 text-base t-text-secondary leading-relaxed max-w-xl font-sans">
              A Uniswap V3 liquidity position can move outside its active tick range.
              When that happens, the position stops earning fees and its exposure changes —
              even though your wallet still simply shows a token/NFT position.
            </p>
          </div>

          {/* Explanatory Range Diagram */}
          <div className="w-full bg-[var(--cp-bg)] border t-border p-6 sm:p-10 font-mono">
            <div className="text-[10px] t-text-muted uppercase tracking-widest font-bold mb-8">
              LIQUIDITY POSITION RANGE — CONCEPTUAL MODEL
            </div>

            {/* Visual Track */}
            <div className="relative">
              {/* Labels above track */}
              <div className="flex justify-between text-[10px] sm:text-xs t-text-muted uppercase tracking-widest font-bold mb-3">
                <span>LOWER BOUND</span>
                <span className="text-[#baf24a]">ACTIVE RANGE</span>
                <span>UPPER BOUND</span>
              </div>

              {/* Track bar */}
              <div className="w-full h-5 bg-[var(--cp-surface-elevated)] border t-border relative overflow-hidden">
                {/* Grid ticks */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--cp-border)_1px,transparent_1px)] bg-[size:5%_100%] opacity-40"></div>
                {/* Active zone */}
                <div className="absolute top-0 bottom-0 left-[20%] right-[20%] bg-[#baf24a]/15 border-x-2 border-[#baf24a]/60">
                  <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(186,242,74,0.08)_4px,rgba(186,242,74,0.08)_8px)]"></div>
                </div>
                {/* Current tick indicator */}
                <div className="absolute top-0 bottom-0 left-[55%] w-1 bg-[#baf24a] shadow-[0_0_8px_#baf24a] -translate-x-1/2 z-10"></div>
              </div>

              {/* Labels below track */}
              <div className="flex justify-between items-start mt-3">
                <div className="flex flex-col items-start text-[10px] t-text-muted">
                  <span className="font-bold">TICK LOWER</span>
                </div>
                <div className="flex flex-col items-center text-[10px]">
                  <span className="text-[#baf24a] font-bold">↑ CURRENT TICK</span>
                  <span className="t-text-muted mt-1">Position earns fees when the tick is inside the active range</span>
                </div>
                <div className="flex flex-col items-end text-[10px] t-text-muted">
                  <span className="font-bold">TICK UPPER</span>
                </div>
              </div>
            </div>

            {/* Status indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 text-xs">
              <div className="flex items-center gap-3 p-3 border border-[#baf24a]/30 bg-[#baf24a]/5">
                <span className="h-3 w-3 bg-[#baf24a] shrink-0"></span>
                <div>
                  <span className="font-bold text-[#baf24a] uppercase tracking-widest">IN RANGE</span>
                  <p className="t-text-secondary mt-1">Tick is between lower and upper bounds. Position is actively earning fees.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-red-500/30 bg-red-500/5">
                <span className="h-3 w-3 bg-red-500 shrink-0"></span>
                <div>
                  <span className="font-bold text-red-400 uppercase tracking-widest">OUT OF RANGE</span>
                  <p className="t-text-secondary mt-1">Tick is outside bounds. Position stops earning and exposure changes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ================================================================
          SECTION 3 — HOW CHAINPILOT WORKS
          ================================================================ */}
      <section className="w-full border-t t-border-strong">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-20 lg:py-28 flex flex-col gap-16">

          <div className="max-w-2xl">
            <div className="text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-widest mb-4">
              <span className="h-1.5 w-1.5 bg-cyan-500 inline-block mr-2"></span>
              HOW IT WORKS
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tighter leading-[0.9] uppercase t-text-heading">
              THREE STEPS.<br />
              <span className="text-cyan-500">ZERO ASSUMPTIONS.</span>
            </h3>
          </div>

          {/* Connected Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-[52px] left-[16.6%] right-[16.6%] h-px t-border-strong z-0"></div>

            {/* Step 01 */}
            <div className="flex flex-col items-start p-6 sm:p-8 border t-border bg-[var(--cp-surface)] relative z-10">
              <span className="text-5xl sm:text-6xl font-display font-black text-[var(--cp-step-number)] leading-none">01</span>
              <h4 className="text-xl font-display font-black uppercase tracking-tight t-text-heading mt-4">CONNECT</h4>
              <div className="w-8 h-0.5 bg-[#00F0FF] mt-3"></div>
              <p className="text-sm t-text-secondary mt-4 font-sans leading-relaxed">
                Provide any EVM wallet address. ChainPilot accepts any Ethereum address — no wallet connection required for analysis.
              </p>
            </div>

            {/* Step 02 */}
            <div className="flex flex-col items-start p-6 sm:p-8 border t-border border-l-0 md:border-l bg-[var(--cp-surface)] relative z-10">
              <span className="text-5xl sm:text-6xl font-display font-black text-[var(--cp-step-number)] leading-none">02</span>
              <h4 className="text-xl font-display font-black uppercase tracking-tight text-[#baf24a] mt-4">VERIFY</h4>
              <div className="w-8 h-0.5 bg-[#baf24a] mt-3"></div>
              <p className="text-sm t-text-secondary mt-4 font-sans leading-relaxed">
                ChainPilot queries indexed Uniswap V3 position data through The Graph&apos;s decentralized indexing protocol. All position data is deterministic and verifiable.
              </p>
            </div>

            {/* Step 03 */}
            <div className="flex flex-col items-start p-6 sm:p-8 border t-border border-l-0 md:border-l bg-[var(--cp-surface)] relative z-10">
              <span className="text-5xl sm:text-6xl font-display font-black text-[var(--cp-step-number)] leading-none">03</span>
              <h4 className="text-xl font-display font-black uppercase tracking-tight text-[#ff5c16] mt-4">EXPLAIN</h4>
              <div className="w-8 h-0.5 bg-[#ff5c16] mt-3"></div>
              <p className="text-sm t-text-secondary mt-4 font-sans leading-relaxed">
                Gemini AI analyzes the verified position data and produces evidence-based risk interpretation, citing the exact on-chain values that inform each assessment.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ================================================================
          SECTION 4 — THE DATA PIPELINE
          ================================================================ */}
      <section className="w-full border-t t-border-strong bg-[var(--cp-surface)]">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-20 lg:py-28 flex flex-col gap-16">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Headline */}
            <div>
              <div className="text-[10px] font-mono text-[#baf24a] font-bold uppercase tracking-widest mb-4">
                <span className="h-1.5 w-1.5 bg-[#baf24a] inline-block mr-2"></span>
                DATA PIPELINE
              </div>
              <h3 className="text-4xl sm:text-5xl font-display font-black tracking-tighter leading-[0.9] uppercase t-text-heading">
                EVERY RISK<br />
                ASSESSMENT<br />
                <span className="text-[#baf24a]">STARTS WITH</span><br />
                <span className="text-[#baf24a]">VERIFIED DATA.</span>
              </h3>
              <p className="mt-8 text-sm t-text-secondary leading-relaxed font-sans max-w-md">
                ChainPilot never invents blockchain data. The Graph provides deterministic,
                indexed position information. Only after verification does the AI layer
                interpret the risk.
              </p>
            </div>

            {/* Right: Architecture Diagram */}
            <div className="font-mono text-xs flex flex-col gap-0">
              {/* Pipeline nodes */}
              {[
                { label: 'WALLET ADDRESS', color: 't-text-heading', border: 't-border', bg: 'bg-[var(--cp-bg)]' },
                { label: 'THE GRAPH — SUBGRAPH INDEXER', color: 'text-cyan-500', border: 'border-cyan-500/30', bg: 'bg-cyan-500/5' },
                { label: 'UNISWAP V3 POSITIONS', color: 'text-[#baf24a]', border: 'border-[#baf24a]/30', bg: 'bg-[#baf24a]/5' },
                { label: 'DETERMINISTIC RANGE ANALYSIS', color: 'text-[#baf24a]', border: 'border-[#baf24a]/30', bg: 'bg-[var(--cp-bg)]' },
              ].map((node, i) => (
                <div key={i}>
                  <div className={`p-4 border ${node.border} ${node.bg} flex items-center gap-3`}>
                    <span className={`h-2 w-2 shrink-0 ${node.color === 'text-cyan-500' ? 'bg-cyan-500' : node.color === 'text-[#baf24a]' ? 'bg-[#baf24a]' : 'bg-[var(--cp-text-heading)]'}`}></span>
                    <span className={`font-bold uppercase tracking-widest ${node.color}`}>{node.label}</span>
                  </div>
                  {i < 3 && (
                    <div className="flex items-center justify-center py-2">
                      <div className="w-px h-6 bg-[var(--cp-border-strong)]"></div>
                    </div>
                  )}
                </div>
              ))}

              {/* Divider: Verified vs AI */}
              <div className="my-4 flex items-center gap-3">
                <div className="flex-1 h-px bg-[var(--cp-border-strong)]"></div>
                <span className="text-[10px] t-text-muted uppercase tracking-widest font-bold px-2 whitespace-nowrap">VERIFIED ON-CHAIN DATA ↑ — AI INTERPRETATION ↓</span>
                <div className="flex-1 h-px bg-[var(--cp-border-strong)]"></div>
              </div>

              {[
                { label: 'GEMINI AI — RISK REASONING', color: 'text-[#d075ff]', border: 'border-[#d075ff]/30', bg: 'bg-[#d075ff]/5' },
                { label: 'RISK INTERPRETATION + EVIDENCE', color: 'text-[#d075ff]', border: 'border-[#d075ff]/30', bg: 'bg-[var(--cp-bg)]' },
                { label: 'USER — REVIEW & DECIDE', color: 't-text-heading', border: 't-border', bg: 'bg-[var(--cp-bg)]' },
              ].map((node, i) => (
                <div key={i}>
                  <div className={`p-4 border ${node.border} ${node.bg} flex items-center gap-3`}>
                    <span className={`h-2 w-2 shrink-0 ${node.color === 'text-[#d075ff]' ? 'bg-[#d075ff]' : 'bg-[var(--cp-text-heading)]'}`}></span>
                    <span className={`font-bold uppercase tracking-widest ${node.color}`}>{node.label}</span>
                  </div>
                  {i < 2 && (
                    <div className="flex items-center justify-center py-2">
                      <div className="w-px h-6 bg-[var(--cp-border-strong)]"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ================================================================
          SECTION 5 — SIGNATURE RANGE EXPERIENCE
          ================================================================ */}
      <section className="w-full border-t t-border-strong">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-20 lg:py-28 flex flex-col gap-12">

          <div className="max-w-2xl">
            <div className="text-[10px] font-mono text-[#ff5c16] font-bold uppercase tracking-widest mb-4">
              <span className="h-1.5 w-1.5 bg-[#ff5c16] inline-block mr-2"></span>
              RANGE INTELLIGENCE
            </div>
            <h3 className="text-4xl sm:text-5xl font-display font-black tracking-tighter leading-[0.9] uppercase t-text-heading">
              POSITION.<br />
              RANGE.<br />
              <span className="text-[#ff5c16]">EXPOSURE.</span><br />
              <span className="text-[#ff5c16]">RISK.</span>
            </h3>
            <p className="mt-8 text-sm t-text-secondary leading-relaxed font-sans max-w-lg">
              ChainPilot renders each position&apos;s tick boundaries and current pool tick
              into a clear visual instrument. You can immediately see whether the position
              is actively earning or has drifted out of range.
            </p>
          </div>

          {/* Live Range Visualizer with illustrative data */}
          <div className="w-full">
            <div className="text-[10px] font-mono t-text-muted uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
              <span className="h-1 w-1 bg-[var(--cp-text-muted)]"></span>
              ILLUSTRATIVE EXAMPLE — NOT LIVE DATA
            </div>
            <LiquidityRangeVisualizer
              tickLower={194000}
              tickUpper={214000}
              currentTick={205000}
              rangeStatus="IN_RANGE"
            />
          </div>

          <div className="w-full mt-4">
            <div className="text-[10px] font-mono t-text-muted uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
              <span className="h-1 w-1 bg-[var(--cp-text-muted)]"></span>
              ILLUSTRATIVE EXAMPLE — OUT OF RANGE SCENARIO
            </div>
            <LiquidityRangeVisualizer
              tickLower={194000}
              tickUpper={214000}
              currentTick={220000}
              rangeStatus="OUT_OF_RANGE"
            />
          </div>
        </div>
      </section>


      {/* ================================================================
          SECTION 6 — AI WITH EVIDENCE
          ================================================================ */}
      <section className="w-full border-t t-border-strong bg-[var(--cp-surface)]">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-20 lg:py-28 flex flex-col gap-16">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="text-[10px] font-mono text-[#d075ff] font-bold uppercase tracking-widest mb-4">
                <span className="h-1.5 w-1.5 bg-[#d075ff] inline-block mr-2"></span>
                AI TRANSPARENCY
              </div>
              <h3 className="text-4xl sm:text-5xl font-display font-black tracking-tighter leading-[0.9] uppercase t-text-heading">
                AI SHOULD<br />
                <span className="text-[#d075ff]">EXPLAIN</span> THE DATA.<br />
                <span className="text-stroke-cyan">NOT INVENT IT.</span>
              </h3>
              <p className="mt-8 text-sm t-text-secondary leading-relaxed font-sans max-w-md">
                ChainPilot&apos;s Gemini AI layer receives verified position data and evaluates risk.
                Every interpretation cites the underlying on-chain evidence.
                The AI never fabricates blockchain state.
              </p>
            </div>

            {/* Evidence Flow */}
            <div className="font-mono text-xs flex flex-col gap-0">
              {[
                { step: '01', label: 'VERIFIED ON-CHAIN DATA', desc: 'Position ticks, pool state, and liquidity values from The Graph.', color: 'text-cyan-500', accent: 'bg-cyan-500' },
                { step: '02', label: 'AI RISK INTERPRETATION', desc: 'Gemini evaluates range status, exposure, and market position.', color: 'text-[#d075ff]', accent: 'bg-[#d075ff]' },
                { step: '03', label: 'EVIDENCE CITATION', desc: 'Each risk assessment cites the exact data fields that informed it.', color: 'text-[#baf24a]', accent: 'bg-[#baf24a]' },
                { step: '04', label: 'SUGGESTED ACTION', desc: 'An evidence-based recommendation the user can review and act on.', color: 'text-[#ff5c16]', accent: 'bg-[#ff5c16]' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="p-5 border t-border bg-[var(--cp-bg)] flex items-start gap-4">
                    <span className={`text-2xl font-display font-black ${item.color} leading-none shrink-0`}>{item.step}</span>
                    <div className="flex flex-col gap-1">
                      <span className={`font-bold uppercase tracking-widest ${item.color}`}>{item.label}</span>
                      <span className="t-text-secondary text-[11px]">{item.desc}</span>
                    </div>
                  </div>
                  {i < 3 && (
                    <div className="flex items-center justify-center py-1.5">
                      <div className={`w-px h-4 ${item.accent} opacity-30`}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ================================================================
          SECTION 7 — USER CONTROL / SAFETY
          ================================================================ */}
      <section className="w-full border-t t-border-strong">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-20 lg:py-28 flex flex-col items-center text-center gap-8">

          <h3 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tighter leading-[0.9] uppercase t-text-heading">
            YOUR WALLET.<br />
            <span className="text-cyan-500">YOUR DECISION.</span>
          </h3>

          <p className="text-base t-text-secondary leading-relaxed max-w-xl font-sans">
            ChainPilot provides analysis and suggests actions based on verified data and AI reasoning.
            You remain in full control. No transaction is ever executed without your explicit approval.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 w-full max-w-3xl font-mono text-xs">
            <div className="p-5 border t-border bg-[var(--cp-bg)] flex flex-col items-center gap-3 text-center">
              <span className="text-2xl font-display font-black text-cyan-500">⛓</span>
              <span className="font-bold t-text uppercase tracking-widest">READ-ONLY ANALYSIS</span>
              <span className="t-text-muted text-[11px]">ChainPilot reads position data. It does not access or move your funds.</span>
            </div>
            <div className="p-5 border t-border bg-[var(--cp-bg)] flex flex-col items-center gap-3 text-center">
              <span className="text-2xl font-display font-black text-[#baf24a]">✓</span>
              <span className="font-bold t-text uppercase tracking-widest">EVIDENCE-BASED</span>
              <span className="t-text-muted text-[11px]">Every risk assessment cites the verified on-chain values that informed it.</span>
            </div>
            <div className="p-5 border t-border bg-[var(--cp-bg)] flex flex-col items-center gap-3 text-center">
              <span className="text-2xl font-display font-black text-[#ff5c16]">⚡</span>
              <span className="font-bold t-text uppercase tracking-widest">USER APPROVAL</span>
              <span className="t-text-muted text-[11px]">Suggested actions require your explicit review and approval before execution.</span>
            </div>
          </div>
        </div>
      </section>


      {/* ================================================================
          SECTION 8 — FINAL CTA
          ================================================================ */}
      <section ref={ctaRef} className="w-full border-t t-border-strong bg-[var(--cp-surface)]">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-20 lg:py-28 flex flex-col items-center text-center gap-10">

          <div className="flex flex-col items-center">
            <h3 className="text-5xl sm:text-6xl md:text-7xl font-display font-black tracking-tighter leading-[0.85] uppercase text-stroke-cyan">
              SEE THE RANGE.
            </h3>
            <h3 className="text-5xl sm:text-6xl md:text-7xl font-display font-black tracking-tighter leading-[0.85] uppercase text-[#ff5c16] mt-2">
              KNOW THE RISK.
            </h3>
          </div>

          <p className="text-base t-text-secondary font-sans max-w-md">
            Enter any Ethereum wallet address to analyze its Uniswap V3 positions.
          </p>

          {/* CTA Wallet Input */}
          <div className="w-full max-w-xl">
            <div className="panel-architecture bg-[var(--cp-surface-elevated)] p-1.5">
              <AddressInput
                externalAddress={null}
                onAnalyze={onAnalyze}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
