/**
 * ChainPilot — Deterministic LP Range Risk Engine
 * 
 * Computes deterministic LP Range Risk Scores and Risk Levels from verified on-chain
 * position telemetry (tick bounds, current pool tick, range ratio P, and tick divergence).
 * 
 * NO React, NO browser APIs, NO AI network dependencies. Pure deterministic mathematics.
 */

import { calculateRangeGeometry, DecisionState } from './rangeGeometry';
import { NormalizedPositionData } from '../graph/types';
import { RiskLevel } from '../ai/types';

export interface PositionRiskScoreResult {
  positionId: string;
  score: number; // 0 to 100
  positionRiskLevel: RiskLevel;
  decisionState: DecisionState;
  deltaOut: number; // Ticks outside active range (0 if in-range)
  rangeRatio: number;
}

export interface PortfolioRiskCalculationResult {
  overallRiskScore: number; // 0 to 100
  overallRiskLevel: RiskLevel;
  riskDescription: string;
  meanRiskScore: number;
  maxRiskScore: number;
  positionScores: PositionRiskScoreResult[];
  transparencyNote: string;
}

export const TRANSPARENCY_NOTE =
  'Score reflects current range status, boundary proximity, and tick divergence from verified on-chain data. It does not estimate USD loss, impermanent loss, or liquidation risk.';

export const RISK_LEVEL_DESCRIPTIONS: Record<RiskLevel, string> = {
  LOW: 'Positions are active and generally well inside their selected ranges.',
  MODERATE: 'Some positions are approaching boundaries or have limited inactive exposure.',
  HIGH: "A significant portion of the portfolio's positions are currently inactive outside their selected ranges.",
  CRITICAL: 'Most or all positions are inactive with substantial range divergence.',
  UNKNOWN: 'On-chain position telemetry unavailable to calculate range risk.',
};

export function getPositionRiskLevel(score: number | null | undefined): RiskLevel {
  if (score === null || score === undefined || isNaN(score)) return 'UNKNOWN';
  if (score <= 19) return 'LOW';
  if (score <= 49) return 'MODERATE';
  if (score <= 79) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Pure function to calculate deterministic risk score S_i for a single position.
 */
export function calculatePositionRiskScore(
  tickLower: number | null | undefined,
  tickUpper: number | null | undefined,
  currentTick: number | null | undefined,
  positionId: string = '0'
): PositionRiskScoreResult {
  const geometry = calculateRangeGeometry(tickLower, tickUpper, currentTick);

  if (!geometry || currentTick === null || currentTick === undefined) {
    return {
      positionId,
      score: 0,
      positionRiskLevel: 'UNKNOWN',
      decisionState: 'CENTERED',
      deltaOut: 0,
      rangeRatio: 0.5,
    };
  }

  const { decisionState, rangeRatio, isBelow, isAbove, tickLower: lower, tickUpper: upper, currentTick: curr } = geometry;

  let score = 0;
  let deltaOut = 0;

  if (decisionState === 'CENTERED') {
    score = 0;
  } else if (decisionState === 'NEAR_LOWER') {
    // 0 <= P < 0.15 -> S_i = 25 * (1 - P / 0.15)
    score = Math.round(25 * (1 - rangeRatio / 0.15));
  } else if (decisionState === 'NEAR_UPPER') {
    // 0.85 < P <= 1.0 -> S_i = 25 * (1 - (1-P) / 0.15)
    score = Math.round(25 * (1 - (1 - rangeRatio) / 0.15));
  } else if (isBelow) {
    deltaOut = lower - curr;
    // S_i = 60 + 40 * min(1, deltaOut / 10000)
    score = Math.round(60 + 40 * Math.min(1, deltaOut / 10000));
  } else if (isAbove) {
    deltaOut = curr - upper;
    // S_i = 60 + 40 * min(1, deltaOut / 10000)
    score = Math.round(60 + 40 * Math.min(1, deltaOut / 10000));
  }

  score = Math.min(100, Math.max(0, score));

  return {
    positionId,
    score,
    positionRiskLevel: getPositionRiskLevel(score),
    decisionState,
    deltaOut,
    rangeRatio,
  };
}

function numberToWord(n: number): string {
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  return n >= 0 && n <= 10 ? words[n] : n.toString();
}

/**
 * Generates dynamic portfolio risk context description strictly from verified position counts and states.
 */
export function generateRiskContextDescription(
  positionScores: PositionRiskScoreResult[]
): string {
  const totalPositions = positionScores.length;
  if (totalPositions === 0) {
    return RISK_LEVEL_DESCRIPTIONS.LOW;
  }

  const outOfRangeScores = positionScores.filter(
    (s) => s.decisionState === 'OUT_BELOW' || s.decisionState === 'OUT_ABOVE'
  );
  const outCount = outOfRangeScores.length;
  const nearCount = positionScores.filter(
    (s) => s.decisionState === 'NEAR_LOWER' || s.decisionState === 'NEAR_UPPER'
  ).length;

  const maxDeltaOut = outOfRangeScores.reduce((max, s) => Math.max(max, s.deltaOut), 0);

  if (outCount === 0) {
    if (nearCount > 0) {
      return 'Some positions remain active but are approaching their selected range boundaries.';
    }
    return 'All positions are currently active within their selected ranges.';
  }

  if (outCount === totalPositions) {
    if (totalPositions === 1) {
      const divergenceSuffix = maxDeltaOut >= 5000 ? ', with significant tick divergence' : '';
      return `Position is currently inactive outside its selected range${divergenceSuffix}.`;
    }
    const divergenceSuffix = maxDeltaOut >= 5000 ? ', with substantial tick divergence' : '';
    return `All ${totalPositions} positions are currently inactive outside their selected ranges${divergenceSuffix}.`;
  }

  // Partial out-of-range positions (e.g. 1/3, 1/2)
  const outWord = outCount === 1 ? 'One' : outCount.toString();
  const totalWord = numberToWord(totalPositions);
  const divergenceSuffix = maxDeltaOut >= 5000 ? ', with significant tick divergence' : '';

  if (outCount === 1) {
    return `${outWord} of ${totalWord} positions is currently inactive outside its selected range${divergenceSuffix}.`;
  }

  return `${outWord} of ${totalWord} positions are currently inactive outside their selected ranges${divergenceSuffix}.`;
}

/**
 * Pure function to calculate deterministic portfolio risk score across multiple verified positions.
 * Implements Option D Hybrid formula:
 * overallRiskScore = round(0.70 * meanRisk + 0.30 * maxRisk)
 */
export function calculatePortfolioRisk(
  positions: NormalizedPositionData[]
): PortfolioRiskCalculationResult {
  if (!positions || positions.length === 0) {
    return {
      overallRiskScore: 0,
      overallRiskLevel: 'LOW',
      riskDescription: RISK_LEVEL_DESCRIPTIONS.LOW,
      meanRiskScore: 0,
      maxRiskScore: 0,
      positionScores: [],
      transparencyNote: TRANSPARENCY_NOTE,
    };
  }

  const positionScores = positions.map((p) =>
    calculatePositionRiskScore(p.tickLower, p.tickUpper, p.currentTick, p.positionId)
  );

  const scoresList = positionScores.map((s) => s.score);
  const sumScores = scoresList.reduce((acc, curr) => acc + curr, 0);
  const meanRiskScore = sumScores / scoresList.length;
  const maxRiskScore = Math.max(...scoresList);

  const rawOverall = Math.round(0.70 * meanRiskScore + 0.30 * maxRiskScore);
  const overallRiskScore = Math.min(100, Math.max(0, rawOverall));

  let overallRiskLevel: RiskLevel;
  if (overallRiskScore <= 19) {
    overallRiskLevel = 'LOW';
  } else if (overallRiskScore <= 49) {
    overallRiskLevel = 'MODERATE';
  } else if (overallRiskScore <= 79) {
    overallRiskLevel = 'HIGH';
  } else {
    overallRiskLevel = 'CRITICAL';
  }

  const riskDescription = generateRiskContextDescription(positionScores);

  return {
    overallRiskScore,
    overallRiskLevel,
    riskDescription,
    meanRiskScore: Math.round(meanRiskScore * 10) / 10,
    maxRiskScore,
    positionScores,
    transparencyNote: TRANSPARENCY_NOTE,
  };
}

