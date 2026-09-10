/**
 * ChainPilot — Protocol Geometry Calculator
 * 
 * Pure deterministic calculation of Uniswap V3 protocol parameters:
 * - Fee tier percentage (sourced from Graph-indexed pool contract data)
 * - Standard tick spacing (derived deterministically from protocol fee tier specification)
 * - Range width in ticks (tickUpper - tickLower)
 * - Number of protocol grid step intervals (rangeWidth / tickSpacing)
 * 
 * NO React, NO browser APIs, NO network calls, NO AI providers.
 */

export interface ProtocolGeometryResult {
  feeTierRaw: string;
  feePercentage: number;
  feePercentageString: string;
  tickSpacing: number;
  rangeWidthTicks: number;
  gridIntervalCount: number;
  dataSourceNote: string;
  protocolSpecNote: string;
}

/**
 * Standard Uniswap V3 fee tier to tick spacing mapping rule:
 * - 100 (0.01% fee)  -> tick spacing = 1
 * - 500 (0.05% fee)  -> tick spacing = 10
 * - 3000 (0.30% fee) -> tick spacing = 60
 * - 10000 (1.00% fee)-> tick spacing = 200
 */
export function getStandardTickSpacingForFeeTier(feeTier: string | number): number {
  const numericFee = typeof feeTier === 'number' ? feeTier : parseInt(feeTier, 10);
  
  if (isNaN(numericFee)) return 60;

  switch (numericFee) {
    case 100:
      return 1;
    case 500:
      return 10;
    case 3000:
      return 60;
    case 10000:
      return 200;
    default:
      return 60;
  }
}

/**
 * Pure function to calculate deterministic Uniswap V3 protocol geometry.
 */
export function calculateProtocolGeometry(
  feeTier: string | null | undefined,
  tickLower: number | null | undefined,
  tickUpper: number | null | undefined
): ProtocolGeometryResult | null {
  if (
    !feeTier ||
    tickLower === null ||
    tickLower === undefined ||
    tickUpper === null ||
    tickUpper === undefined ||
    isNaN(tickLower) ||
    isNaN(tickUpper) ||
    tickUpper <= tickLower
  ) {
    return null;
  }

  const rawFeeNum = parseInt(feeTier, 10);
  const feePercentage = isNaN(rawFeeNum) ? 0.3 : rawFeeNum / 10000;
  const feePercentageString = `${feePercentage}%`;

  const tickSpacing = getStandardTickSpacingForFeeTier(feeTier);
  const lower = Math.min(tickLower, tickUpper);
  const upper = Math.max(tickLower, tickUpper);
  const rangeWidthTicks = upper - lower;
  const gridIntervalCount = Math.floor(rangeWidthTicks / tickSpacing);

  return {
    feeTierRaw: feeTier,
    feePercentage,
    feePercentageString,
    tickSpacing,
    rangeWidthTicks,
    gridIntervalCount,
    dataSourceNote: `feeTier (${feeTier}) is sourced from pool contract via The Graph.`,
    protocolSpecNote: `tickSpacing (${tickSpacing}) is derived from standard Uniswap V3 protocol fee tier mapping (100->1, 500->10, 3000->60, 10000->200).`,
  };
}
