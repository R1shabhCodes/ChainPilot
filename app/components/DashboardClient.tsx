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

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] bg-grid-pattern selection:bg-[var(--accent-purple-glow)] selection:text-[var(--accent-purple)]">
      {/* Top Navigation Bar */}
      <header className="w-full border-b border-[var(--border-color)] bg-[var(--bg-surface)] border-orange-top sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded panel-sharp bg-[var(--bg-surface-elevated)] border-[var(--border-color)] flex items-center justify-center font-display font-bold text-[var(--accent-orange)] text-sm shadow-sm">
            CP
          </div>
          <div>
            <h1 className="font-display font-extrabold text-lg leading-none tracking-tight">
              Chain<span className="gradient-text-purple">Pilot</span>
            </h1>
            <p className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">DeFi Risk & Portfolio Copilot</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-semibold bg-[var(--bg-surface-elevated)] text-[var(--accent-purple)] border border-[var(--border-color)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-orange)] animate-pulse"></span>
            ETHOnline 2026
          </span>
          <PrivyAuthButton onWalletSelect={(address) => setSelectedAddress(address)} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Hero Section & 3D Compass Motif */}
        <section className="text-center max-w-3xl mx-auto flex flex-col items-center gap-5 py-4">
          <ChainPilotCompass />

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight leading-tight">
            Turn On-Chain Complexity Into <br />
            <span className="gradient-text-hero">Evidence-Backed Intelligence</span>
          </h2>
          
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
            Connect your wallet or enter an EVM address to query indexed Uniswap v3 position health 
            via The Graph and receive transparent, evidence-backed AI risk evaluations.
          </p>

          {/* Reusable Address Input */}
          <div className="w-full mt-2">
            <AddressInput
              externalAddress={selectedAddress}
              onAnalyze={(address) => setSelectedAddress(address)}
            />
          </div>
        </section>

        {/* Portfolio Command Center Grid: Native Balance & Risk Score Gauge */}
        {selectedAddress && (
          <section className="max-w-4xl w-full mx-auto flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Native Balance Telemetry Card */}
              <NativeBalanceCard address={selectedAddress} />

              {/* Dominant Risk Score Gauge Command Card */}
              <RiskScoreGauge
                analysis={aiAnalysis}
                loading={aiLoading}
                statusNotice={aiNotice}
                error={aiError}
              />
            </div>

            {/* Position Category Filter Controls */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Position Overview Filters
              </h4>
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

            {/* AI Risk Card Presentation Renderer */}
            <AIRiskCard
              analysis={aiAnalysis}
              loading={aiLoading}
              statusNotice={aiNotice}
              error={aiError}
              onRetry={() => fetchAiAnalysis(selectedAddress)}
              onSelectAction={(action, position) => setSelectedActionState({ action, position })}
            />
          </section>
        )}

        {/* System Architecture Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Subgraph Data */}
          <div className="panel-sharp panel-sharp-hover p-6 flex flex-col gap-3 border-accent-top">
            <div className="h-9 w-9 rounded panel-sharp bg-[var(--bg-surface-elevated)] text-[var(--accent-purple)] flex items-center justify-center font-mono font-bold text-xs">
              01
            </div>
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">Indexed On-Chain Telemetry</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Queries real-time positions, liquidity mints/burns, and pool tick health directly from 
              The Graph network subgraphs.
            </p>
            <div className="mt-auto pt-4 border-t border-[var(--border-color)] text-xs font-mono text-[var(--accent-purple)] flex items-center justify-between">
              <span>The Graph Integration</span>
              <span>Phase 3</span>
            </div>
          </div>

          {/* Card 2: AI Reasoning */}
          <div className="panel-sharp panel-sharp-hover p-6 flex flex-col gap-3 border-orange-top">
            <div className="h-9 w-9 rounded panel-sharp bg-[var(--bg-surface-elevated)] text-[var(--accent-orange)] flex items-center justify-center font-mono font-bold text-xs">
              02
            </div>
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">Evidence-Backed AI Intelligence</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Processes raw subgraph telemetry to produce risk evaluations, position alerts, and 
              verifiable on-chain evidence citations.
            </p>
            <div className="mt-auto pt-4 border-t border-[var(--border-color)] text-xs font-mono text-[var(--accent-orange)] flex items-center justify-between">
              <span>Gemini AI Engine</span>
              <span>Phase 4</span>
            </div>
          </div>

          {/* Card 3: Execution Flow */}
          <div className="panel-sharp panel-sharp-hover p-6 flex flex-col gap-3 border-blue-top">
            <div className="h-9 w-9 rounded panel-sharp bg-[var(--bg-surface-elevated)] text-[var(--accent-blue)] flex items-center justify-center font-mono font-bold text-xs">
              03
            </div>
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">User-Approved Safety Flow</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Prepares transparent transaction proposals for user sign-off via Privy embedded 
              wallets with zero automatic actions.
            </p>
            <div className="mt-auto pt-4 border-t border-[var(--border-color)] text-xs font-mono text-[var(--accent-blue)] flex items-center justify-between">
              <span>Privy Flow</span>
              <span>Phase 6</span>
            </div>
          </div>
        </section>
      </main>

      {/* Action Approval Modal */}
      <ActionApprovalModal
        isOpen={Boolean(selectedActionState)}
        action={selectedActionState?.action || null}
        position={selectedActionState?.position || null}
        onClose={() => setSelectedActionState(null)}
      />

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-6 px-6 text-center text-xs font-mono text-[var(--text-muted)]">
        <p>ChainPilot — Built for ETHOnline 2026. Evidence-backed copilot, non-custodial and transparent.</p>
      </footer>
    </div>
  );
}
