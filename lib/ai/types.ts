// ChainPilot AI Reasoning Engine Data Contracts

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';

export type RangeStatus = 'IN_RANGE' | 'OUT_OF_RANGE' | 'UNKNOWN';

export type AIStatus = 'SUCCESS' | 'UNAVAILABLE' | 'PARTIAL';
export type AIProviderName = 'GROQ' | 'GEMINI' | 'NONE';
export type ProviderStatusState = 'ACTIVE' | 'STANDBY' | 'RATE_LIMITED' | 'UNAVAILABLE' | 'DISABLED';

export interface ProviderStatusReport {
  groqStatus: ProviderStatusState;
  geminiStatus: ProviderStatusState;
  activeProvider: AIProviderName;
  details?: string;
}

import { DecisionConsideration, PortfolioDecisionSummary } from '@/lib/decision/decisionEngine';

export interface ComputedPositionMetrics {
  positionId: string;
  lowerBound: number;
  upperBound: number;
  currentTick: number | null;
  isInRange: boolean;
  isBelow: boolean;
  isAbove: boolean;
  tickDistanceLower: number | null;
  tickDistanceUpper: number | null;
  ticksFromActiveRange: number | null;
  rangeDiagnosisText: string;
  rangeRatio?: number | null;
  decisionConsideration?: DecisionConsideration | null;
}

export interface EvidenceCitation {
  field: string;
  value: string;
  sourceRef: string;
}

export interface ExecutableTxPayload {
  chainId: number;
  to: string;
  data: string;
  value: string;
  actionSpecificParams?: Record<string, string>;
}

export interface SuggestedAction {
  id: string;
  actionType: 'REBALANCE' | 'WITHDRAW' | 'REPAY' | 'HOLD';
  title: string;
  description: string;
  riskWarning?: string;
  suggestedParameters?: Record<string, string>;
  executablePayload?: ExecutableTxPayload;
}

export interface PositionRiskSummary {
  positionId: string;
  protocol: string;
  tokenPair: string;
  riskLevel: RiskLevel;
  rangeStatus: RangeStatus;
  whatIFound?: string;
  whyItMatters?: string;
  evidence: EvidenceCitation[];
  summary: string;
  suggestedAction?: SuggestedAction;
  tickLower?: number;
  tickUpper?: number;
  currentTick?: number | null;
  computedMetrics?: ComputedPositionMetrics;
  decisionConsideration?: DecisionConsideration | null;
  poolAddress?: string;
  token0Address?: string;
  token1Address?: string;
  feeTier?: string;
}

export interface PortfolioAnalysisResponse {
  address: string;
  overallRiskScore?: number; // 0 to 100 (undefined if AI is unavailable)
  overallRiskLevel?: RiskLevel;
  aiStatus: AIStatus;
  providerStatus: ProviderStatusReport;
  positionSummaries: PositionRiskSummary[];
  portfolioDecisionSummary?: PortfolioDecisionSummary | null;
  analyzedAt: string;
  summaryText?: string;
}
