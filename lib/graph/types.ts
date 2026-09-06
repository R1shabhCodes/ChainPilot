// ChainPilot The Graph Subgraph Data Contracts

export interface RawGraphToken {
  id: string;
  symbol: string;
  decimals: string;
}

export interface RawGraphTick {
  tickIdx: string;
}

export interface RawGraphPool {
  id: string;
  feeTier: string;
  tick: string | null;
  sqrtPrice: string | null;
  token0Price: string | null;
  token1Price: string | null;
}

export interface RawGraphPosition {
  id: string;
  owner: string;
  liquidity: string;
  tickLower: RawGraphTick;
  tickUpper: RawGraphTick;
  depositedToken0?: string;
  depositedToken1?: string;
  withdrawnToken0?: string;
  withdrawnToken1?: string;
  collectedFeesToken0?: string;
  collectedFeesToken1?: string;
  token0: RawGraphToken;
  token1: RawGraphToken;
  pool: RawGraphPool;
}

export interface NormalizedPositionData {
  positionId: string;
  protocol: string;
  tokenPair: string;
  owner: string;
  liquidity: string;
  rangeStatus: 'IN_RANGE' | 'OUT_OF_RANGE' | 'UNKNOWN';
  tickLower: number;
  tickUpper: number;
  currentTick: number | null;
  depositedToken0: string;
  depositedToken1: string;
  collectedFeesToken0: string;
  collectedFeesToken1: string;
  token0Symbol: string;
  token1Symbol: string;
  feeTier: string;
  subgraphSourceRef: string;
}

export type GraphFetchResult =
  | {
      success: true;
      status: 'POSITIONS_FOUND';
      positions: NormalizedPositionData[];
      rawJson: string;
    }
  | {
      success: true;
      status: 'NO_POSITIONS_FOUND';
      positions: [];
      message: string;
    }
  | {
      success: false;
      status: 'DATA_SOURCE_UNAVAILABLE';
      code: 'GRAPH_API_KEY_REQUIRED' | 'KEY_NOT_CONFIGURED';
      message: string;
    }
  | {
      success: false;
      status: 'GRAPH_ERROR';
      message: string;
    };
