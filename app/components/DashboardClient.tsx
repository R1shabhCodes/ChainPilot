'use client';

import { useState, useEffect, useCallback } from 'react';
import PrivyAuthButton from './PrivyAuthButton';
import AddressInput from './AddressInput';
import NativeBalanceCard from './NativeBalanceCard';
import RiskScoreGauge from './RiskScoreGauge';
import PositionFilterTabs, { PositionFilter } from './PositionFilterTabs';
import AIRiskCard, { AnalyzeStatusNotice } from './AIRiskCard';
import ActionApprovalModal from './ActionApprovalModal';
import ChainPilotCompass from './ChainPilotCompass';
import { PortfolioAnalysisResponse, SuggestedAction, PositionRiskSummary } from '@/lib/ai/types';

export default function DashboardClient() {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<PositionFilter>('ALL');

  // AI Pipeline States
  const [aiAnalysis, setAiAnalysis] = useState<PortfolioAnalysisResponse | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiNotice, setAiNotice] = useState<AnalyzeStatusNotice | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Action Modal State
  const [selectedActionState, setSelectedActionState] = useState<{
    action: SuggestedAction;
    position: PositionRiskSummary;
  } | null>(null);

  const fetchAiAnalysis = useCallback((address: string) => {
    setAiLoading(true);
    setAiError(null);
    setAiNotice(null);
    setAiAnalysis(null);
    setSelectedActionState(null);

    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (res.status === 428 || data.status === 'DATA_SOURCE_UNAVAILABLE') {
          setAiNotice({
            status: data.status || 'DATA_SOURCE_UNAVAILABLE',
            code: data.code || 'GRAPH_API_KEY_REQUIRED',
            message: data.message || 'Live Graph Subgraph position data is required.',
            canAnalyze: false,
          });
          setAiLoading(false);
          return;
        }

        if (data.status === 'NO_POSITIONS_FOUND') {
          setAiNotice({
            status: data.status,
            code: data.code || 'ZERO_POSITIONS',
            message: data.message || 'No active Uniswap v3 positions were found for this address.',
            canAnalyze: false,
          });
          setAiLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error(data.error || 'Failed to complete AI risk analysis.');
        }

        setAiAnalysis(data);
        setAiLoading(false);
      })
      .catch((err: any) => {
        setAiError(typeof err === 'string' ? err : err.message || 'Error connecting to AI API route');
        setAiLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedAddress && /^0x[a-fA-F0-9]{40}$/.test(selectedAddress)) {
      fetchAiAnalysis(selectedAddress);
    } else {
      setAiAnalysis(null);
      setAiLoading(false);
      setAiNotice(null);
      setAiError(null);
      setSelectedActionState(null);
    }
  }, [selectedAddress, fetchAiAnalysis]);

  // Filter position summaries based on active tab
  const filteredPositions = aiAnalysis?.positionSummaries?.filter((p) => {
    if (activeFilter === 'IN_RANGE') return p.rangeStatus === 'IN_RANGE';
    if (activeFilter === 'OUT_OF_RANGE') return p.rangeStatus === 'OUT_OF_RANGE';
    if (activeFilter === 'CRITICAL_RISK') return p.riskLevel === 'CRITICAL';
    return true;
  }) || [];

  const filteredAnalysis: PortfolioAnalysisResponse | null = aiAnalysis
    ? { ...aiAnalysis, positionSummaries: filteredPositions }
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#05070c] text-slate-100 bg-grid-pattern selection:bg-[#00F0FF]/20 selection:text-[#00F0FF]">
      {/* Top Command & Navigation Bar */}
      <header className="w-full border-b border-slate-800/80 bg-[#0a0d14]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-[#00F0FF]/10 border border-[#00F0FF]/40 flex items-center justify-center font-black text-[#00F0FF] text-xs">
            CP
          </div>
          <div>
            <h1 className="font-display font-black text-base leading-none tracking-tight flex items-center gap-2">
              Chain<span className="text-[#00F0FF]">Pilot</span>
              <span className="text-[10px] font-mono font-normal text-slate-400 border border-slate-800 px-1.5 py-0.2 bg-slate-950">
                v1.0
              </span>
            </h1>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">DeFi Risk Intelligence Platform</p>
          </div>
        </div>

        {/* Header Address Quick Switcher when in workspace mode */}
        {selectedAddress && (
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1 text-xs">
            <span className="h-2 w-2 rounded-full bg-[#BAF24A] animate-pulse"></span>
            <span className="text-slate-400 font-semibold">Active Target:</span>
            <span className="text-slate-100 font-bold">
              {selectedAddress.slice(0, 8)}...{selectedAddress.slice(-6)}
            </span>
            <button
              onClick={() => setSelectedAddress(null)}
              className="ml-2 text-[10px] text-cyan-400 hover:text-white uppercase font-bold underline cursor-pointer"
            >
              Switch
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-[#BAF24A] bg-[#BAF24A]/10 border border-[#BAF24A]/30">
            <span className="h-1.5 w-1.5 rounded-full bg-[#BAF24A]"></span>
            ETHONLINE 2026
          </span>
          <PrivyAuthButton onWalletSelect={(address) => setSelectedAddress(address)} />
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col gap-10">
        {/* STATE 1: UNANALYZED LANDING EXPERIENCE */}
        {!selectedAddress && (
          <>
            <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 border-b border-slate-800/60 pb-12">
              {/* Left Column (7 cols): Editorial Headline & Search Input */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-950 border border-slate-800 text-[10px] font-mono text-[#00F0FF] w-fit">
                  <span className="h-1.5 w-1.5 bg-[#00F0FF]"></span>
                  VERIFIED ON-CHAIN DEFI RISK COPILOT
                </div>

                <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight leading-none uppercase">
                  <span className="text-[#BAF24A] block">SEE THE RANGE.</span>
                  <span className="text-white block mt-1">KNOW THE RISK.</span>
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed max-w-xl font-sans">
                  ChainPilot queries indexed Uniswap v3 positions directly from The Graph and applies transparent 
                  Gemini AI evaluations to detect range status, out-of-bounds exposure, and evidence-backed mitigation steps.
                </p>

                {/* Search Command Input Bar */}
                <div className="w-full pt-2">
                  <AddressInput
                    externalAddress={selectedAddress}
                    onAnalyze={(address) => setSelectedAddress(address)}
                  />
                </div>
              </div>

              {/* Right Column (5 cols): Signature Visual Object */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <ChainPilotCompass />
              </div>
            </section>

            {/* Product Architectural Pillars */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-[#0a0d14] border border-slate-800 p-5 flex flex-col gap-3 font-mono">
                <div className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-wider">
                  [ 01 // TELEMETRY ]
                </div>
                <h3 className="font-display font-bold text-sm text-slate-100">Indexed On-Chain Data</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Queries real-time positions, liquidity mints, and pool tick health directly from 
                  The Graph network subgraphs.
                </p>
              </div>

              <div className="bg-[#0a0d14] border border-slate-800 p-5 flex flex-col gap-3 font-mono">
                <div className="text-[10px] font-bold text-[#BAF24A] uppercase tracking-wider">
                  [ 02 // INTELLIGENCE ]
                </div>
                <h3 className="font-display font-bold text-sm text-slate-100">Evidence-Backed AI Evaluation</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Processes raw subgraph telemetry to produce risk evaluations, position alerts, and 
                  verifiable evidence citations.
                </p>
              </div>

              <div className="bg-[#0a0d14] border border-slate-800 p-5 flex flex-col gap-3 font-mono">
                <div className="text-[10px] font-bold text-[#D075FF] uppercase tracking-wider">
                  [ 03 // EXECUTION ]
                </div>
                <h3 className="font-display font-bold text-sm text-slate-100">User-Approved Actions</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Prepares transparent transaction proposals for explicit user review with zero 
                  automated execution.
                </p>
              </div>
            </section>
          </>
        )}

        {/* STATE 2: FULL-WIDTH ANALYZED DEFI WORKSPACE */}
        {selectedAddress && (
          <section className="w-full flex flex-col gap-8 animate-fadeIn">
            {/* Top Workspace Bar: Search Switcher Container */}
            <div className="w-full bg-[#0a0d14] border border-slate-800 p-4 font-mono flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-[#00F0FF] animate-pulse"></div>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  DEFI RISK INTELLIGENCE WORKSPACE
                </span>
              </div>
              <div className="w-full sm:w-auto min-w-[340px]">
                <AddressInput
                  externalAddress={selectedAddress}
                  onAnalyze={(address) => setSelectedAddress(address)}
                />
              </div>
            </div>

            {/* Dominant Hero Portfolio Command Bar */}
            <RiskScoreGauge
              analysis={aiAnalysis}
              loading={aiLoading}
              statusNotice={aiNotice}
              error={aiError}
            />

            {/* 2-Column Workspace Viewport Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Main Column (8 cols / ~65% width): Position Inspector */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 font-mono">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-[#00F0FF]"></span>
                      UNISWAP V3 POSITION INSPECTOR
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      REAL ON-CHAIN POSITIONS
                    </span>
                  </div>

                  <PositionFilterTabs
                    activeFilter={activeFilter}
                    onFilterChange={(filter) => setActiveFilter(filter)}
                    counts={{
                      all: aiAnalysis?.positionSummaries?.length,
                      inRange: aiAnalysis?.positionSummaries?.filter(p => p.rangeStatus === 'IN_RANGE').length,
                      outOfRange: aiAnalysis?.positionSummaries?.filter(p => p.rangeStatus === 'OUT_OF_RANGE').length,
                      criticalRisk: aiAnalysis?.positionSummaries?.filter(p => p.riskLevel === 'CRITICAL').length,
                    }}
                  />
                </div>

                {/* Primary Position Inspector Cards Renderer */}
                <AIRiskCard
                  analysis={filteredAnalysis}
                  loading={aiLoading}
                  statusNotice={aiNotice}
                  error={aiError}
                  onRetry={() => fetchAiAnalysis(selectedAddress)}
                  onSelectAction={(action, position) => setSelectedActionState({ action, position })}
                />
              </div>

              {/* Side Column (4 cols / ~35% width): On-Chain Telemetry & Health Panel */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* Native Balance Telemetry Panel */}
                <NativeBalanceCard address={selectedAddress} />

                {/* System Pipeline Status Card */}
                <div className="bg-[#090b10] border border-slate-800 p-5 font-mono flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-[#BAF24A]"></span>
                      SYSTEM TELEMETRY STATUS
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5 text-xs text-slate-300">
                    <div className="p-2.5 bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-400">The Graph Subgraph:</span>
                      <span className="text-[#BAF24A] font-bold">ONLINE</span>
                    </div>

                    <div className="p-2.5 bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-400">Gemini 3.6 AI Engine:</span>
                      <span className="text-[#00F0FF] font-bold">ACTIVE</span>
                    </div>

                    <div className="p-2.5 bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-400">Target Chain:</span>
                      <span className="text-slate-200 font-bold">ETH MAINNET (1)</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 leading-relaxed">
                    ChainPilot evaluates raw subgraph payload ticks and produces zero ungrounded facts.
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Action Approval Modal */}
      <ActionApprovalModal
        isOpen={Boolean(selectedActionState)}
        action={selectedActionState?.action || null}
        position={selectedActionState?.position || null}
        onClose={() => setSelectedActionState(null)}
      />

      {/* Terminal Status Footer Ticker */}
      <footer className="border-t border-slate-800 bg-[#0a0d14] py-3.5 px-6 font-mono text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#BAF24A]"></span>
            THE GRAPH GATEWAY: ONLINE
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF]"></span>
            GEMINI 3.6 ENGINE: ACTIVE
          </span>
        </div>
        <p className="text-slate-400">ChainPilot — Built for ETHOnline 2026. Non-custodial & Transparent.</p>
      </footer>
    </div>
  );
}
