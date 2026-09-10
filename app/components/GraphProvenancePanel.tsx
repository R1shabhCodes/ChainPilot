'use client';

import React, { useState } from 'react';
import { GraphRequestMetadata } from '@/lib/graph/types';

export interface GraphProvenancePanelProps {
  graphMeta?: GraphRequestMetadata;
  className?: string;
}

export default function GraphProvenancePanel({ graphMeta, className = '' }: GraphProvenancePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!graphMeta) return null;

  return (
    <div className={`w-full panel-architecture bg-[var(--cp-surface)] p-4 sm:p-5 font-mono border-t-2 border-t-cyan-500/80 flex flex-col gap-4 ${className}`}>
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b t-border pb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-cyan-500">
            THE GRAPH SUBGRAPH PROVENANCE AUDIT
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] sm:text-[9px] px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 font-bold uppercase tracking-wider">
            DECENTRALIZED INDEXER VERIFIED
          </span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
        <div className="p-2.5 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-0.5">
          <span className="t-text-muted uppercase text-[8px] font-bold tracking-wider">Subgraph Deployment</span>
          <span className="font-bold text-cyan-500 truncate" title={graphMeta.deploymentId}>
            {graphMeta.deploymentId.slice(0, 10)}...{graphMeta.deploymentId.slice(-6)}
          </span>
        </div>

        <div className="p-2.5 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-0.5">
          <span className="t-text-muted uppercase text-[8px] font-bold tracking-wider">Gateway Status</span>
          <span className="font-bold text-[#baf24a]">
            HTTP {graphMeta.httpStatus} OK
          </span>
        </div>

        <div className="p-2.5 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-0.5">
          <span className="t-text-muted uppercase text-[8px] font-bold tracking-wider">Indexer Latency</span>
          <span className="font-bold t-text">
            {graphMeta.latencyMs} ms
          </span>
        </div>

        <div className="p-2.5 bg-[var(--cp-surface-elevated)] border t-border flex flex-col gap-0.5">
          <span className="t-text-muted uppercase text-[8px] font-bold tracking-wider">Positions Indexed</span>
          <span className="font-bold text-purple-400">
            {graphMeta.positionCount} {graphMeta.positionCount === 1 ? 'position' : 'positions'}
          </span>
        </div>
      </div>

      {/* Drawer Toggle */}
      <div className="flex justify-between items-center pt-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[9px] font-bold text-cyan-500 hover:underline flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
        >
          <span>{isExpanded ? '[- CLOSE RAW GRAPHQL QUERY & METADATA]' : '[+ INSPECT RAW GRAPHQL QUERY & ENDPOINT]'}</span>
        </button>
        <span className="text-[8px] t-text-muted font-sans hidden md:inline">
          API Key Masked for Security
        </span>
      </div>

      {/* Expandable Audit Drawer */}
      {isExpanded && (
        <div className="p-4 bg-[var(--cp-bg)] border t-border flex flex-col gap-3 font-mono text-[10px] mt-1">
          <div className="flex flex-col gap-1">
            <span className="t-text-muted font-bold text-[9px] uppercase tracking-wider">Masked Gateway Endpoint URL:</span>
            <span className="p-2 bg-[var(--cp-surface-elevated)] border t-border text-cyan-500 break-all">
              {graphMeta.endpointMasked}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[9px]">
            <div className="flex justify-between border-b t-border pb-1">
              <span className="t-text-muted">Query Operation Name:</span>
              <span className="font-bold t-text">{graphMeta.queryName}</span>
            </div>
            <div className="flex justify-between border-b t-border pb-1">
              <span className="t-text-muted">Execution Timestamp:</span>
              <span className="font-bold t-text">{new Date(graphMeta.timestamp).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="t-text-muted font-bold text-[9px] uppercase tracking-wider">GraphQL Query Document:</span>
            <pre className="p-3 bg-[var(--cp-surface-elevated)] border t-border text-[9px] t-text-secondary overflow-x-auto font-mono leading-relaxed">
              {graphMeta.queryText}
            </pre>
          </div>

          <div className="p-2.5 bg-cyan-500/5 border border-cyan-500/20 text-[9px] font-sans t-text-muted leading-relaxed">
            <strong className="text-cyan-500 font-mono font-bold">SOURCE OF TRUTH BOUNDARY: </strong>
            All position liquidity facts are indexed live from The Graph Subgraph Gateway. ChainPilot Layer 2 deterministic calculations and Layer 3 AI interpretations consume these verified facts without mutating or inventing on-chain state.
          </div>
        </div>
      )}
    </div>
  );
}
