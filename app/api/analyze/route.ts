import { NextResponse } from 'next/server';
import { fetchUniswapPositions } from '@/lib/graph/client';
import { evaluatePositionsWithGemini } from '@/lib/ai/geminiClient';

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
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // Step 3: Verified positions exist -> Call Gemini AI reasoning engine with verified data only
    const aiAnalysis = await evaluatePositionsWithGemini(address, graphResult.rawJson);

    return NextResponse.json(aiAnalysis, { status: 200 });
  } catch (error: any) {
    console.error('Error in /api/analyze route handler:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing the portfolio analysis request.' },
      { status: 500 }
    );
  }
}
