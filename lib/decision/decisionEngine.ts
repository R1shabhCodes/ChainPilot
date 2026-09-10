/**
 * ChainPilot — Deterministic Decision Engine
 * 
 * Generates neutral, non-prescriptive operational decision considerations
 * derived strictly from verified range geometry calculations.
 * 
 * NO React, NO browser APIs, NO network calls, NO AI providers, NO wallet calls.
 * Pure deterministic functions only.
 */

import { calculateRangeGeometry, DecisionState, RangeGeometryResult } from './rangeGeometry';

export interface DecisionConsideration {
  state: DecisionState;
  statusHeading: string;
  whyText: string;
  considerations: string[];
  userControlNotice: string;
  rangeRatio: number;
  lowerDistancePercent: number | null;
  upperDistancePercent: number | null;
}

export interface PortfolioDecisionSummary {
  activeCount: number;
  inactiveCount: number;
  nearBoundaryCount: number;
  summaryText: string;
  generalConsideration: string;
}

const DEFAULT_USER_CONTROL_NOTICE = 'ChainPilot does not execute trades or automatically change your position.';

/**
 * Pure function generating decision considerations for a single liquidity position.
 */
export function generateDecisionConsideration(
  tickLower: number | null | undefined,
  tickUpper: number | null | undefined,
  currentTick: number | null | undefined
): DecisionConsideration | null {
  const geometry = calculateRangeGeometry(tickLower, tickUpper, currentTick);
  if (!geometry) return null;

  return buildDecisionFromGeometry(geometry);
}

/**
 * Helper to build DecisionConsideration from an existing RangeGeometryResult
 */
export function buildDecisionFromGeometry(geometry: RangeGeometryResult): DecisionConsideration {
  const { decisionState, rangeRatio, lowerDistancePercent, upperDistancePercent } = geometry;

  switch (decisionState) {
    case 'OUT_BELOW':
      return {
        state: 'OUT_BELOW',
        statusHeading: 'OUT OF RANGE — BELOW',
        whyText: 'Current tick is below your selected lower bound. Your position has become effectively single-sided and is currently inactive.',
        considerations: [
          'Consider reviewing whether your intended market outlook still matches this lower boundary.',
          'Inspect accrued swap fees and current single-sided token composition.',
          'Evaluate whether re-centering your range aligns with your overall strategy.',
          'No new swap fees are earned while the position is inactive.',
        ],
        userControlNotice: DEFAULT_USER_CONTROL_NOTICE,
        rangeRatio,
        lowerDistancePercent: null,
        upperDistancePercent: null,
      };

    case 'OUT_ABOVE':
      return {
        state: 'OUT_ABOVE',
        statusHeading: 'OUT OF RANGE — ABOVE',
        whyText: 'Current tick is above your selected upper bound. Your position has become effectively single-sided and is currently inactive.',
        considerations: [
          'Consider reviewing whether your intended market outlook still matches this upper boundary.',
          'Inspect accrued swap fees and current single-sided token composition.',
          'Evaluate whether a different range structure fits current market conditions.',
          'No new swap fees are earned while the position is inactive.',
        ],
        userControlNotice: DEFAULT_USER_CONTROL_NOTICE,
        rangeRatio,
        lowerDistancePercent: null,
        upperDistancePercent: null,
      };

    case 'NEAR_LOWER':
      return {
        state: 'NEAR_LOWER',
        statusHeading: 'APPROACHING LOWER BOUND',
        whyText: `Current tick is ${lowerDistancePercent ?? 0}% from the lower edge of your selected range.`,
        considerations: [
          'Consider monitoring the lower boundary as market price moves.',
          'Review whether your selected range still matches your intended exposure.',
          'Inspect accrued swap fees and position composition if price crosses out of range.',
        ],
        userControlNotice: DEFAULT_USER_CONTROL_NOTICE,
        rangeRatio,
        lowerDistancePercent,
        upperDistancePercent,
      };

    case 'NEAR_UPPER':
      return {
        state: 'NEAR_UPPER',
        statusHeading: 'APPROACHING UPPER BOUND',
        whyText: `Current tick is ${upperDistancePercent ?? 0}% from the upper edge of your selected range.`,
        considerations: [
          'Consider monitoring the upper boundary as market price moves.',
          'Review whether your selected range still matches your intended exposure.',
          'Inspect accrued swap fees and position composition if price crosses out of range.',
        ],
        userControlNotice: DEFAULT_USER_CONTROL_NOTICE,
        rangeRatio,
        lowerDistancePercent,
        upperDistancePercent,
      };

    case 'CENTERED':
    default:
      return {
        state: 'CENTERED',
        statusHeading: 'WITHIN SELECTED RANGE',
        whyText: `Current tick is relatively centered within your selected range (${lowerDistancePercent ?? 0}% from lower bound, ${upperDistancePercent ?? 0}% from upper bound).`,
        considerations: [
          'Your liquidity is currently active and can earn swap fees.',
          'Continue routine monitoring of your selected price range.',
          'Review the position if your intended exposure or market outlook changes.',
        ],
        userControlNotice: DEFAULT_USER_CONTROL_NOTICE,
        rangeRatio,
        lowerDistancePercent,
        upperDistancePercent,
      };
  }
}

/**
 * Pure function generating concise portfolio-level decision summary.
 */
export function generatePortfolioDecisionSummary(
  geometries: Array<RangeGeometryResult | null>
): PortfolioDecisionSummary {
  const validGeometries = geometries.filter((g): g is RangeGeometryResult => g !== null);

  if (validGeometries.length === 0) {
    return {
      activeCount: 0,
      inactiveCount: 0,
      nearBoundaryCount: 0,
      summaryText: 'No active position telemetry available to analyze.',
      generalConsideration: 'Ensure target address holds active Uniswap V3 liquidity positions.',
    };
  }

  const activeCount = validGeometries.filter((g) => g.isInRange).length;
  const inactiveCount = validGeometries.filter((g) => g.isBelow || g.isAbove).length;
  const nearBoundaryCount = validGeometries.filter(
    (g) => g.decisionState === 'NEAR_LOWER' || g.decisionState === 'NEAR_UPPER'
  ).length;

  let summaryText = '';
  if (inactiveCount === 0) {
    summaryText = `${activeCount} position${activeCount === 1 ? '' : 's'} within selected range${activeCount === 1 ? '' : 's'}.`;
  } else {
    summaryText = `${activeCount} position${activeCount === 1 ? ' is' : 's are'} within selected range${activeCount === 1 ? '' : 's'}. ${inactiveCount} position${inactiveCount === 1 ? ' is' : 's are'} currently inactive outside range.`;
  }

  let generalConsideration = '';
  if (inactiveCount > 0) {
    generalConsideration = 'Consider reviewing inactive positions and their current single-sided token compositions.';
  } else if (nearBoundaryCount > 0) {
    generalConsideration = 'Consider monitoring positions approaching range boundaries as market conditions fluctuate.';
  } else {
    generalConsideration = 'All positions are relatively centered. Continue routine monitoring as market prices move.';
  }

  return {
    activeCount,
    inactiveCount,
    nearBoundaryCount,
    summaryText,
    generalConsideration,
  };
}
