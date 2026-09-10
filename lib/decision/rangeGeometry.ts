/**
 * ChainPilot — Range Geometry Calculator
 * 
 * Pure deterministic mathematics for Uniswap V3 concentrated liquidity ranges.
 * NO React, NO browser APIs, NO network calls, NO AI providers, NO wallet dependencies.
 */

export type DecisionState = 'OUT_BELOW' | 'OUT_ABOVE' | 'NEAR_LOWER' | 'NEAR_UPPER' | 'CENTERED';

/**
 * PRODUCT/UX HEURISTIC CONSTANT:
 * The 15% (0.15) threshold is a user experience classification boundary used to signal
 * when current price is relatively close to a range boundary. It is NOT a mathematical
 * truth or universal indicator of safety/risk.
 */
export const PROXIMITY_HEURISTIC = {
  BOUNDARY_THRESHOLD_RATIO: 0.15,
};

export interface RangeGeometryResult {
  tickLower: number;
  tickUpper: number;
  currentTick: number;
  rangeWidth: number; // W = tickUpper - tickLower
  rangeRatio: number; // P = (currentTick - tickLower) / W
  lowerDistancePercent: number | null; // (currentTick - tickLower) / W * 100
  upperDistancePercent: number | null; // (tickUpper - currentTick) / W * 100
  isInRange: boolean; // Protocol fact: currentTick >= tickLower && currentTick <= tickUpper
  isBelow: boolean;    // Protocol fact: currentTick < tickLower
  isAbove: boolean;    // Protocol fact: currentTick > tickUpper
  decisionState: DecisionState; // UX interpretation
}

/**
 * Pure function to calculate deterministic range geometry.
 * Returns null if ticks are invalid, null, or tickUpper <= tickLower.
 */
export function calculateRangeGeometry(
  tickLower: number | null | undefined,
  tickUpper: number | null | undefined,
  currentTick: number | null | undefined
): RangeGeometryResult | null {
  if (
    tickLower === null ||
    tickLower === undefined ||
    tickUpper === null ||
    tickUpper === undefined ||
    currentTick === null ||
    currentTick === undefined ||
    isNaN(tickLower) ||
    isNaN(tickUpper) ||
    isNaN(currentTick) ||
    tickUpper <= tickLower
  ) {
    return null;
  }

  const lower = Math.min(tickLower, tickUpper);
  const upper = Math.max(tickLower, tickUpper);
  const curr = currentTick;

  const rangeWidth = upper - lower;
  if (rangeWidth <= 0) return null;

  // Relative Position Ratio P
  const rangeRatio = (curr - lower) / rangeWidth;

  // Protocol / Range Facts (Booleans preserved as requested)
  const isInRange = curr >= lower && curr <= upper;
  const isBelow = curr < lower;
  const isAbove = curr > upper;

  // Proximity Percentages (Only populated when inside or at range bounds)
  let lowerDistancePercent: number | null = null;
  let upperDistancePercent: number | null = null;

  if (isInRange) {
    lowerDistancePercent = Math.round(rangeRatio * 1000) / 10; // e.g. 14.9
    upperDistancePercent = Math.round((1 - rangeRatio) * 1000) / 10;
  }

  // Decision State UX Classification using 15% Heuristic
  let decisionState: DecisionState;

  if (isBelow) {
    decisionState = 'OUT_BELOW';
  } else if (isAbove) {
    decisionState = 'OUT_ABOVE';
  } else if (rangeRatio < PROXIMITY_HEURISTIC.BOUNDARY_THRESHOLD_RATIO) {
    // 0 <= P < 0.15
    decisionState = 'NEAR_LOWER';
  } else if (rangeRatio > 1 - PROXIMITY_HEURISTIC.BOUNDARY_THRESHOLD_RATIO) {
    // 0.85 < P <= 1.0
    decisionState = 'NEAR_UPPER';
  } else {
    // 0.15 <= P <= 0.85
    decisionState = 'CENTERED';
  }

  return {
    tickLower: lower,
    tickUpper: upper,
    currentTick: curr,
    rangeWidth,
    rangeRatio,
    lowerDistancePercent,
    upperDistancePercent,
    isInRange,
    isBelow,
    isAbove,
    decisionState,
  };
}
