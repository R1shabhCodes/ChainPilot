import { NextResponse } from 'next/server';
import { fetchUniswapPositions } from '@/lib/graph/client';
import { evaluatePortfolioWithProviders } from '@/lib/ai/provider';
import { NormalizedPositionData } from '@/lib/graph/types';
import { ComputedPositionMetrics } from '@/lib/ai/types';

function computePositionMetrics(pos: NormalizedPositionData): ComputedPositionMetrics {
  const lower = pos.tickLower;
  const upper = pos.tickUpper;
  const curr = pos.currentTick;

  let isInRange = false;
  let isBelow = false;
  let isAbove = false;
  let tickDistanceLower: number | null = null;
  let tickDistanceUpper: number | null = null;
  let ticksFromActiveRange: number | null = null;
  let rangeDiagnosisText = 'UNKNOWN RANGE STATUS';

  if (curr !== null) {
    isInRange = curr >= lower && curr <= upper;
    isBelow = curr < lower;
    isAbove = curr > upper;

    tickDistanceLower = curr - lower;
    tickDistanceUpper = upper - curr;

    if (isInRange) {
      const distToLower = curr - lower;
      const distToUpper = upper - curr;
      ticksFromActiveRange = 0;
      rangeDiagnosisText = `POSITION IN RANGE (${distToLower.toLocaleString('en-US')} ticks above lower bound, ${distToUpper.toLocaleString('en-US')} ticks below upper bound)`;
    } else if (isBelow) {
      ticksFromActiveRange = lower - curr;
      rangeDiagnosisText = `${ticksFromActiveRange.toLocaleString('en-US')} TICKS BELOW LOWER ACTIVE BOUND`;
    } else {
      ticksFromActiveRange = curr - upper;
      rangeDiagnosisText = `${ticksFromActiveRange.toLocaleString('en-US')} TICKS ABOVE UPPER ACTIVE BOUND`;
    }
  }

  return {
    positionId: pos.positionId,
    lowerBound: lower,
    upperBound: upper,
    currentTick: curr,
    isInRange,
    isBelow,
    isAbove,
    tickDistanceLower,
    tickDistanceUpper,
    ticksFromActiveRange,
    rangeDiagnosisText,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const address = body.address?.trim();

    // Validate EVM address format
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid EVM address format. Must start with 0x followed by 40 hex characters.' },
        { status: 400 }
      );
    }

    // Step 1: Query server-side Graph Subgraph integration for verified positions
    const graphResult = await fetchUniswapPositions(address);

    if (!graphResult.success) {
      if (graphResult.status === 'DATA_SOURCE_UNAVAILABLE') {
        return NextResponse.json(
          {
            status: 'DATA_SOURCE_UNAVAILABLE',
            code: graphResult.code,
            message: graphResult.message,
            address,
            canAnalyze: false,
            timestamp: new Date().toISOString(),
          },
          { status: 428 } // HTTP 428 Precondition Required
        );
      }

      return NextResponse.json(
        { error: graphResult.message || 'Error querying subgraph position data.' },
        { status: 502 }
      );
    }

    // Step 2: Handle empty positions response (NO_POSITIONS_FOUND)
    if (graphResult.status === 'NO_POSITIONS_FOUND') {
      return NextResponse.json(
        {
          status: 'NO_POSITIONS_FOUND',
          code: 'ZERO_POSITIONS',
          message: graphResult.message,
          address,
          canAnalyze: false,
          positions: [],
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    const positions = graphResult.positions || [];

    // Step 3: Compute deterministic metrics outside the LLM for every position
    const computedMetricsMap: Record<string, ComputedPositionMetrics> = {};
    positions.forEach((pos) => {
      computedMetricsMap[pos.positionId] = computePositionMetrics(pos);
    });

    // Step 4: Evaluate with multi-provider AI resilience engine (Groq -> Gemini -> Fallback)
    const aiAnalysis = await evaluatePortfolioWithProviders(address, graphResult.rawJson || '[]', positions);

    // Merge computed metrics into position summaries
    const enrichedSummaries = aiAnalysis.positionSummaries.map((summary) => ({
      ...summary,
      computedMetrics: computedMetricsMap[summary.positionId],
    }));

    return NextResponse.json(
      {
        ...aiAnalysis,
        positionSummaries: enrichedSummaries,
        verifiedPositions: positions,
        rawJson: graphResult.rawJson,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in /api/analyze route handler:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing the portfolio analysis request.' },
      { status: 500 }
    );
  }
}
