import { NextResponse } from 'next/server';

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

    // Check if verified live Graph Subgraph position data source is configured
    const graphKey = process.env.THE_GRAPH_API_KEY;
    const isGraphConfigured = Boolean(graphKey && graphKey !== 'your_the_graph_api_key_here');

    if (!isGraphConfigured) {
      // Return explicit structured status — NEVER fabricate fake or mocked position data
      return NextResponse.json(
        {
          status: 'DATA_SOURCE_UNAVAILABLE',
          code: 'GRAPH_API_KEY_REQUIRED',
          message: 'Live Graph Subgraph data integration is required for portfolio risk analysis. Please configure THE_GRAPH_API_KEY in .env.local to enable live indexing.',
          address,
          canAnalyze: false,
          timestamp: new Date().toISOString(),
        },
        { status: 428 } // HTTP 428 Precondition Required
      );
    }

    // Pipeline Foundation: When THE_GRAPH_API_KEY is configured in Phase 3,
    // server-fetched verified subgraph positions will be passed to evaluatePositionsWithGemini() here.
    return NextResponse.json({
      status: 'READY_FOR_SUBGRAPH_PIPELINE',
      address,
      message: 'Server AI pipeline foundation ready for server-fetched Subgraph payloads.',
    });
  } catch (error: any) {
    console.error('Error in /api/analyze route handler:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the analysis request.' },
      { status: 500 }
    );
  }
}
