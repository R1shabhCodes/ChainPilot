// ChainPilot AI Reasoning Engine Data Contracts

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type RangeStatus = 'IN_RANGE' | 'OUT_OF_RANGE' | 'UNKNOWN';

export interface EvidenceCitation {
  field: string;
  value: string;
  sourceRef: string;
}

export interface SuggestedAction {
  id: string;
  actionType: 'REBALANCE' | 'WITHDRAW' | 'REPAY' | 'HOLD';
  title: string;
  description: string;
  riskWarning?: string;
  suggestedParameters?: Record<string, string>;
}

export interface PositionRiskSummary {
  positionId: string;
  protocol: string;
  tokenPair: string;
  riskLevel: RiskLevel;
  rangeStatus: RangeStatus;
  evidence: EvidenceCitation[];
  summary: string;
  suggestedAction?: SuggestedAction;
}

export interface PortfolioAnalysisResponse {
  address: string;
  overallRiskScore: number; // 0 to 100
  overallRiskLevel: RiskLevel;
  positionSummaries: PositionRiskSummary[];
  analyzedAt: string;
}
