'use client';

import { useState, useEffect, useCallback } from 'react';
import PrivyAuthButton from './PrivyAuthButton';
import AddressInput from './AddressInput';
import NativeBalanceCard from './NativeBalanceCard';
import RiskScoreGauge from './RiskScoreGauge';
import PositionFilterTabs, { PositionFilter } from './PositionFilterTabs';
import AIRiskCard, { AnalyzeStatusNotice } from './AIRiskCard';
import ActionApprovalModal from './ActionApprovalModal';
import LandingPage from './LandingPage';
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
      <main className={`flex-1 w-full mx-auto flex flex-col transition-layout ${selectedAddress ? 'px-4 sm:px-8 py-8' : ''}`}>
        
        {/* STATE 1: SCROLLABLE LANDING EXPERIENCE */}
        {!selectedAddress && (
          <LandingPage onAnalyze={(address) => setSelectedAddress(address)} />
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
                <span className="text-[10px] text-slate-500 font-mono">
                  {aiAnalysis?.analyzedAt ? `LAST ANALYZED: ${new Date(aiAnalysis.analyzedAt).toLocaleTimeString()}` : ''}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <button
                  onClick={() => selectedAddress && fetchAiAnalysis(selectedAddress)}
                  disabled={aiLoading}
                  className="px-3 py-2 bg-[#0a0d14] hover:bg-[#141a29] text-[#00F0FF] border border-[#00F0FF]/40 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span className={`h-2 w-2 bg-[#00F0FF] ${aiLoading ? 'animate-spin' : ''}`}></span>
                  {aiLoading ? 'REFRESHING...' : 'REFRESH ON-CHAIN STATE'}
                </button>
                <div className="w-full lg:w-[340px]">
                  <AddressInput
                    externalAddress={selectedAddress}
                    onAnalyze={(address) => setSelectedAddress(address)}
                  />
                </div>
              </div>
            </div>

            {/* Global Portfolio Risk Overview */}
            <RiskScoreGauge
              analysis={aiAnalysis}
              loading={aiLoading}
              statusNotice={aiNotice}
              error={aiError}
            />

            {/* INTENTIONAL ZERO POSITIONS PANEL */}
            {aiNotice && aiNotice.code === 'ZERO_POSITIONS' && (
              <div className="w-full panel-architecture bg-[#06080d] p-8 border-t-2 border-t-cyan-500 font-mono flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-[#141a29] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 bg-cyan-400"></span>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-100">
                      ZERO ACTIVE UNISWAP V3 POSITIONS
                    </h3>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-cyan-950/60 border border-cyan-800 text-cyan-400 font-bold">
                    VERIFIED ON-CHAIN
                  </span>
                </div>

                <p className="text-xs font-sans text-slate-300 leading-relaxed max-w-3xl">
                  {aiNotice.message} No active indexed Uniswap V3 liquidity positions with non-zero liquidity were detected for address <span className="font-mono text-cyan-300 font-bold">{selectedAddress}</span>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3 bg-[#020306] border border-[#141a29] flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">NETWORK SCANNED</span>
                    <span className="text-xs font-bold text-slate-200">Ethereum Mainnet (Chain ID 1)</span>
                  </div>
                  <div className="p-3 bg-[#020306] border border-[#141a29] flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">PROTOCOL AUDITED</span>
                    <span className="text-xs font-bold text-slate-200">Uniswap V3 Core Factory</span>
                  </div>
                  <div className="p-3 bg-[#020306] border border-[#141a29] flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">DATA PROVIDER</span>
                    <span className="text-xs font-bold text-cyan-300">The Graph Subgraph Gateway</span>
                  </div>
                </div>
              </div>
            )}

            {/* WORKSPACE COMMAND CENTER LAYOUT: Secondary List + Dominant View */}
            {aiAnalysis && (
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
                      SYSTEM TELEMETRY STATUS
                    </div>
                    <div className="flex flex-col gap-2 text-[10px] text-slate-400">
                      <div className="flex justify-between items-center bg-[#020306] p-1.5 border border-[#141a29]">
                        <span>The Graph Subgraph:</span><span className="text-[#baf24a] font-bold">CONNECTED</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#020306] p-1.5 border border-[#141a29]">
                        <span>Ethereum Mainnet RPC:</span><span className="text-[#baf24a] font-bold">CONNECTED</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#020306] p-1.5 border border-[#141a29]">
                        <span>AI Provider Engine:</span>
                        <span className="font-bold text-[#00F0FF]">
                          {aiAnalysis?.providerStatus?.activeProvider || (aiAnalysis?.aiStatus === 'UNAVAILABLE' ? 'OFFLINE' : 'STANDBY')}
                        </span>
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
                    onRetry={() => selectedAddress && fetchAiAnalysis(selectedAddress)}
                    onSelectAction={(action, position) => setSelectedActionState({ action, position })}
                  />
                </div>
                
              </div>
            )}</section>
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
      <footer className="border-t border-[#1e283d] bg-[#020306] py-4 px-6 font-mono text-[10px] text-slate-500 flex flex-wrap items-center justify-between gap-4 uppercase font-bold tracking-widest z-50 relative">
        <div className="flex items-center gap-6">
          <span className="text-slate-300">CHAINPILOT</span>
          <span className="text-slate-600">|</span>
          <span>AI-POWERED DEFI RISK INTELLIGENCE</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 bg-[#00F0FF]"></span>THE GRAPH</span>
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 bg-[#d075ff]"></span>GEMINI</span>
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 bg-[#baf24a]"></span>PRIVY</span>
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 bg-[#ff5c16]"></span>ETHONLINE 2026</span>
        </div>
      </footer>
    </div>
  );
}
