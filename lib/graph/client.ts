import {
  RawGraphPosition,
  NormalizedPositionData,
  GraphFetchResult,
} from './types';

const SUBGRAPH_DEPLOYMENT_ID = '5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV';

const UNISWAP_V3_POSITIONS_QUERY = `
  query GetUserPositions($owner: Bytes!) {
    positions(where: { owner: $owner, liquidity_gt: "0" }) {
      id
      owner
      liquidity
      tickLower {
        tickIdx
      }
      tickUpper {
        tickIdx
      }
      depositedToken0
      depositedToken1
      collectedFeesToken0
      collectedFeesToken1
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      pool {
        id
        feeTier
        tick
        sqrtPrice
        token0Price
        token1Price
      }
    }
  }
`;

export async function fetchUniswapPositions(address: string): Promise<GraphFetchResult> {
  const apiKey = process.env.THE_GRAPH_API_KEY;
  const isGraphConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_the_graph_api_key_here');

  if (!isGraphConfigured) {
    return {
      success: false,
      status: 'DATA_SOURCE_UNAVAILABLE',
      code: 'GRAPH_API_KEY_REQUIRED',
      message: 'Live Graph Subgraph data integration requires THE_GRAPH_API_KEY to be set in .env.local.',
    };
  }

  // Ensure owner address is safely normalized to lowercase string
  const normalizedOwner = address.trim().toLowerCase();
  const endpoint = `https://gateway.thegraph.com/api/${apiKey}/subgraphs/id/${SUBGRAPH_DEPLOYMENT_ID}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: UNISWAP_V3_POSITIONS_QUERY,
        variables: { owner: normalizedOwner },
      }),
      next: { revalidate: 30 }, // 30s cache for position queries
    });

    if (!response.ok) {
      console.error(`The Graph Gateway returned HTTP status ${response.status}`);
      return {
        success: false,
        status: 'GRAPH_ERROR',
        message: `The Graph Gateway API returned HTTP status ${response.status}.`,
      };
    }

    const payload = await response.json();

    if (payload.errors && payload.errors.length > 0) {
      const errMessage = payload.errors[0]?.message || 'GraphQL Query returned errors.';
      console.error('The Graph Query Error:', errMessage);
      return {
        success: false,
        status: 'GRAPH_ERROR',
        message: `Subgraph query error: ${errMessage}`,
      };
    }

    const rawPositions: RawGraphPosition[] = payload.data?.positions || [];

    if (rawPositions.length === 0) {
      return {
        success: true,
        status: 'NO_POSITIONS_FOUND',
        positions: [],
        message: `No active Uniswap v3 liquidity positions were found on Ethereum mainnet for address ${address}.`,
      };
    }

    const normalizedPositions: NormalizedPositionData[] = rawPositions.map((pos) => {
      const lowerTickIdx = parseInt(pos.tickLower?.tickIdx || '0', 10);
      const upperTickIdx = parseInt(pos.tickUpper?.tickIdx || '0', 10);
      const currentPoolTick = pos.pool?.tick ? parseInt(pos.pool.tick, 10) : null;

      let rangeStatus: 'IN_RANGE' | 'OUT_OF_RANGE' | 'UNKNOWN' = 'UNKNOWN';
      if (currentPoolTick !== null) {
        rangeStatus = currentPoolTick >= lowerTickIdx && currentPoolTick <= upperTickIdx ? 'IN_RANGE' : 'OUT_OF_RANGE';
      }

      const feePercentage = pos.pool?.feeTier ? `${parseInt(pos.pool.feeTier, 10) / 10000}%` : 'Pool';
      const token0Symbol = pos.token0?.symbol || 'TOKEN0';
      const token1Symbol = pos.token1?.symbol || 'TOKEN1';

      return {
        positionId: pos.id,
        protocol: 'Uniswap v3 (Ethereum Mainnet)',
        tokenPair: `${token0Symbol}/${token1Symbol} (${feePercentage})`,
        owner: pos.owner,
        liquidity: pos.liquidity,
        rangeStatus,
        tickLower: lowerTickIdx,
        tickUpper: upperTickIdx,
        currentTick: currentPoolTick,
        depositedToken0: pos.depositedToken0 || '0',
        depositedToken1: pos.depositedToken1 || '0',
        collectedFeesToken0: pos.collectedFeesToken0 || '0',
        collectedFeesToken1: pos.collectedFeesToken1 || '0',
        token0Symbol,
        token1Symbol,
        feeTier: pos.pool?.feeTier || '3000',
        subgraphSourceRef: `The Graph Subgraph (ID: ${SUBGRAPH_DEPLOYMENT_ID}) - NFT #${pos.id}`,
        poolAddress: pos.pool?.id,
        token0Address: pos.token0?.id,
        token1Address: pos.token1?.id,
      };
    });

    return {
      success: true,
      status: 'POSITIONS_FOUND',
      positions: normalizedPositions,
      rawJson: JSON.stringify(normalizedPositions, null, 2),
    };
  } catch (error: any) {
    console.error('Error fetching from The Graph Gateway:', error);
    return {
      success: false,
      status: 'GRAPH_ERROR',
      message: `Failed to connect to The Graph Gateway: ${error.message || error}`,
    };
  }
}
