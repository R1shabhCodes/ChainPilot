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
  
  // Workspace Focus State
  const [focusedPositionId, setFocusedPositionId] = useState<string | null>(null);

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
    setFocusedPositionId(null);

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
        // Automatically focus the first position with critical risk or just the first position
        if (data.positionSummaries && data.positionSummaries.length > 0) {
          const critical = data.positionSummaries.find((p: any) => p.riskLevel === 'CRITICAL');
          setFocusedPositionId(critical ? critical.positionId : data.positionSummaries[0].positionId);
        }
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
      setFocusedPositionId(null);
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
    <div className="min-h-screen flex flex-col bg-[#020306] text-slate-100 bg-dot-pattern selection:bg-[#00F0FF]/20 selection:text-[#00F0FF] transition-layout">
      {/* Top Command & Navigation Bar */}
      <header className="w-full border-b border-[#1e283d] bg-[#06080d]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-[#00F0FF] flex items-center justify-center font-black text-[#020306] text-sm panel-architecture">
            CP
          </div>
          <div className="flex flex-col">
            <h1 className="font-display font-black text-lg leading-none tracking-tight flex items-center gap-2 uppercase">
              Chain<span className="text-[#00F0FF]">Pilot</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] font-mono font-bold text-[#baf24a] px-1.5 py-0.5 bg-[#baf24a]/10 border border-[#baf24a]/30">
                v1.0
              </span>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Risk Intelligence</p>
            </div>
          </div>
        </div>

        {/* Header Address Quick Switcher when in workspace mode */}
        {selectedAddress && (
          <div className="flex items-center gap-3 panel-flat px-4 py-2 text-xs">
            <span className="h-2 w-2 bg-[#00f0ff] animate-pulse"></span>
            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Target:</span>
            <span className="text-slate-100 font-bold font-mono">
              {selectedAddress.slice(0, 8)}...{selectedAddress.slice(-6)}
            </span>
            <div className="w-px h-3 bg-[#1e283d] mx-1"></div>
            <button
              onClick={() => setSelectedAddress(null)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 uppercase font-black cursor-pointer transition-colors"
            >
              [ SWITCH ]
            </button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono font-bold text-slate-300 bg-[#0a0d14] border border-[#1e283d]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d075ff]"></span>
            ETHONLINE 2026
          </span>
          <PrivyAuthButton onWalletSelect={(address) => setSelectedAddress(address)} />
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-8 py-8 flex flex-col transition-layout">
        
        {/* STATE 1: UNANALYZED LANDING EXPERIENCE */}
        {!selectedAddress && (
          <div className="w-full max-w-screen-2xl mx-auto min-h-[80vh] flex flex-col justify-center animate-fadeIn">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
              
              {/* Background Architectural Lines */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                <div className="absolute top-0 left-1/4 w-px h-full bg-cyan-500/30"></div>
                <div className="absolute top-1/3 left-0 w-full h-px bg-cyan-500/30"></div>
              </div>

              {/* Left Column: Editorial Headline & Search Input */}
              <div className="lg:col-span-6 flex flex-col gap-8 z-10">
                <div className="inline-flex items-center gap-3 px-3 py-1.5 panel-flat text-[10px] font-mono text-[#00F0FF] w-fit font-bold tracking-widest uppercase">
                  <span className="h-1.5 w-1.5 bg-[#00F0FF]"></span>
                  Verified On-Chain DeFi Intelligence
                </div>

                <div className="flex flex-col">
                  <h2 className="text-6xl sm:text-[80px] md:text-[100px] font-display font-black tracking-tighter leading-[0.85] uppercase text-stroke-cyan">
                    SEE THE
                  </h2>
                  <h2 className="text-6xl sm:text-[80px] md:text-[100px] font-display font-black tracking-tighter leading-[0.85] uppercase text-[#baf24a] -ml-2">
                    RANGE.
                  </h2>
                  <h2 className="text-6xl sm:text-[80px] md:text-[100px] font-display font-black tracking-tighter leading-[0.85] uppercase text-white mt-4">
                    KNOW THE
                  </h2>
                  <h2 className="text-6xl sm:text-[80px] md:text-[100px] font-display font-black tracking-tighter leading-[0.85] uppercase text-[#ff5c16] -ml-2">
                    RISK.
                  </h2>
                </div>

                <p className="text-base text-slate-400 leading-relaxed max-w-lg font-sans border-l-2 border-[#1e283d] pl-4">
                  ChainPilot queries indexed Uniswap v3 positions directly from The Graph and applies transparent 
                  Gemini AI evaluations to detect range status, out-of-bounds exposure, and evidence-backed mitigation steps.
                </p>

                {/* Search Command Input Bar */}
                <div className="w-full max-w-xl pt-4">
                  <div className="panel-architecture bg-[#0a0d14] p-1.5">
                    <AddressInput
                      externalAddress={selectedAddress}
                      onAnalyze={(address) => setSelectedAddress(address)}
                    />
                  </div>
                  <div className="flex gap-4 mt-4 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">
                    <span>[ LIVE ETHEREUM DATA ]</span>
                    <span>[ UNISWAP V3 ]</span>
                    <span>[ AI RISK ANALYSIS ]</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Massive Signature Visual Object */}
              <div className="lg:col-span-6 relative flex items-center justify-center min-h-[500px]">
                <div className="absolute w-[150%] h-[150%] -right-[20%] top-1/2 -translate-y-1/2 pointer-events-none opacity-90 z-0 mix-blend-screen">
                  <ChainPilotCompass />
                </div>
                {/* Structural Anchors around compass */}
                <div className="absolute top-10 right-10 text-[9px] font-mono text-cyan-500/50 text-right uppercase tracking-widest hidden md:block">
                  <div className="border-b border-cyan-500/30 pb-1 mb-1">SEC 01 - ACTIVE BOUNDS</div>
                  <div>TICK RANGE EXPOSURE</div>
                </div>
                <div className="absolute bottom-10 left-10 text-[9px] font-mono text-lime-500/50 uppercase tracking-widest hidden md:block">
                  <div className="border-b border-lime-500/30 pb-1 mb-1">SEC 02 - TELEMETRY</div>
                  <div>GRAPH INDEX SYNC</div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* STATE 2: FULL-WIDTH ANALYZED DEFI WORKSPACE */}
        {selectedAddress && (
          <section className="w-full max-w-[1600px] mx-auto flex flex-col gap-6 animate-fadeIn">
            {/* Top Workspace Command Bar */}
            <div className="w-full panel-flat p-4 font-mono flex flex-col lg:flex-row items-center justify-between gap-6 border-cyan-top">
              <div className="flex items-center gap-4">
                <div className="h-3 w-3 bg-[#00F0FF] animate-pulse"></div>
                <span className="text-sm font-black text-slate-100 uppercase tracking-widest">
                  PORTFOLIO // <span className="text-cyan-400">{aiAnalysis?.positionSummaries?.length || 0} POSITIONS</span>
                </span>
              </div>
              <div className="w-full lg:w-1/3 min-w-[340px]">
                <AddressInput
                  externalAddress={selectedAddress}
                  onAnalyze={(address) => setSelectedAddress(address)}
                />
              </div>
            </div>

            {/* Global Portfolio Risk Overview */}
            <RiskScoreGauge
              analysis={aiAnalysis}
              loading={aiLoading}
              statusNotice={aiNotice}
              error={aiError}
            />

            {/* WORKSPACE COMMAND CENTER LAYOUT: Secondary List + Dominant View */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start mt-4">
              
              {/* Left Navigation Column (3 cols / ~25%): The Position List */}
              <div className="xl:col-span-3 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[#1e283d] pb-2 font-mono">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
                    INDEXED POSITIONS
                  </h4>
                </div>

                <PositionFilterTabs
                  activeFilter={activeFilter}
                  onFilterChange={(filter) => {
                    setActiveFilter(filter);
                    // Reset focus when filter changes
                    setFocusedPositionId(null);
                  }}
                  counts={{
                    all: aiAnalysis?.positionSummaries?.length,
                    inRange: aiAnalysis?.positionSummaries?.filter(p => p.rangeStatus === 'IN_RANGE').length,
                    outOfRange: aiAnalysis?.positionSummaries?.filter(p => p.rangeStatus === 'OUT_OF_RANGE').length,
                    criticalRisk: aiAnalysis?.positionSummaries?.filter(p => p.riskLevel === 'CRITICAL').length,
                  }}
                />

                {/* Secondary Sidebar Navigation Cards */}
                <div className="flex flex-col gap-3 mt-2 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                  {filteredPositions.map((pos) => {
                    const isFocused = focusedPositionId === pos.positionId;
                    return (
                      <div
                        key={pos.positionId}
                        onClick={() => setFocusedPositionId(pos.positionId)}
                        className={`p-3 font-mono cursor-pointer transition-all border-l-2 ${
                          isFocused 
                            ? 'bg-[#0a0d14] border-l-[#00F0FF] border-y border-r border-y-[#1e283d] border-r-[#1e283d] shadow-[0_0_15px_rgba(0,240,255,0.05)]' 
                            : 'bg-[#06080d] border-l-transparent border-y border-r border-y-transparent border-r-transparent hover:bg-[#0a0d14] hover:border-[#1e283d] text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-bold text-xs tracking-tight ${isFocused ? 'text-white' : ''}`}>
                            {pos.tokenPair}
                          </span>
                          <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 text-slate-400">#{pos.positionId}</span>
                        </div>
                        <div className="flex gap-2 text-[9px] font-bold uppercase">
                          <span className={
                            pos.riskLevel === 'CRITICAL' ? 'text-red-400' :
                            pos.riskLevel === 'HIGH' ? 'text-orange-400' :
                            pos.riskLevel === 'MODERATE' ? 'text-amber-400' : 'text-[#baf24a]'
                          }>
                            {pos.riskLevel}
                          </span>
                          <span className="text-slate-600">/</span>
                          <span className={pos.rangeStatus === 'IN_RANGE' ? 'text-[#baf24a]' : 'text-red-400'}>
                            {pos.rangeStatus === 'IN_RANGE' ? 'IN RANGE' : 'OUT'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {filteredPositions.length === 0 && !aiLoading && (
                    <div className="text-xs text-slate-500 font-mono italic p-4 text-center border border-dashed border-[#1e283d]">
                      No positions match filter.
                    </div>
                  )}
                </div>

                {/* System Telemetry Side Panel */}
                <div className="mt-6 panel-architecture p-4 font-mono flex flex-col gap-3">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#baf24a] border-b border-[#1e283d] pb-2">
                    TELEMETRY STATUS
                  </div>
                  <div className="flex flex-col gap-2 text-[10px] text-slate-400">
                    <div className="flex justify-between items-center bg-[#020306] p-1.5 border border-[#141a29]">
                      <span>The Graph:</span><span className="text-[#baf24a] font-bold">ONLINE</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#020306] p-1.5 border border-[#141a29]">
                      <span>Gemini 3.6:</span><span className="text-[#00F0FF] font-bold">ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Column (9 cols / ~75%): DOMINANT POSITION INSPECTOR */}
              <div className="xl:col-span-9 flex flex-col gap-6">
                <AIRiskCard
                  analysis={filteredAnalysis}
                  loading={aiLoading}
                  statusNotice={aiNotice}
                  error={aiError}
                  focusedPositionId={focusedPositionId}
                  onRetry={() => fetchAiAnalysis(selectedAddress)}
                  onSelectAction={(action, position) => setSelectedActionState({ action, position })}
                />
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
      <footer className="border-t border-[#1e283d] bg-[#020306] py-3 px-6 font-mono text-[10px] text-slate-500 flex flex-wrap items-center justify-between gap-4 uppercase font-bold tracking-widest z-50 relative">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-[#baf24a]"></span>
            SUBGRAPH: ONLINE
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-[#00f0ff]"></span>
            AI ENGINE: ACTIVE
          </span>
        </div>
        <p>ChainPilot — Built for ETHOnline 2026.</p>
      </footer>
    </div>
  );
}
