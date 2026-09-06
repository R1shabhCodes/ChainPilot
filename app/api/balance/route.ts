import { NextResponse } from 'next/server';

const PRIMARY_RPC = 'https://ethereum-rpc.publicnode.com';
const FALLBACK_RPC = 'https://1rpc.io/eth';

async function fetchFromRpc(endpoint: string, method: string, params: any[]) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: 1,
    }),
    next: { revalidate: 10 }, // Short 10-second cache
  });

  if (!response.ok) {
    throw new Error(`RPC endpoint returned status ${response.status}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || 'RPC method error');
  }

  return data.result;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address')?.trim();

  // Validate EVM format
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json(
      { error: 'Invalid EVM address format. Must start with 0x followed by 40 hex characters.' },
      { status: 400 }
    );
  }

  try {
    let rpcUsed = PRIMARY_RPC;
    let balanceHex: string;
    let blockHex: string;

    try {
      [balanceHex, blockHex] = await Promise.all([
        fetchFromRpc(PRIMARY_RPC, 'eth_getBalance', [address, 'latest']),
        fetchFromRpc(PRIMARY_RPC, 'eth_blockNumber', []),
      ]);
    } catch (primaryErr) {
      console.warn('Primary RPC failed, switching to fallback:', primaryErr);
      rpcUsed = FALLBACK_RPC;
      [balanceHex, blockHex] = await Promise.all([
        fetchFromRpc(FALLBACK_RPC, 'eth_getBalance', [address, 'latest']),
        fetchFromRpc(FALLBACK_RPC, 'eth_blockNumber', []),
      ]);
    }

    const weiBigInt = BigInt(balanceHex);
    const ethBalance = Number(weiBigInt) / 1e18;
    const blockNumber = parseInt(blockHex, 16);

    return NextResponse.json({
      address,
      ethBalance: ethBalance.toFixed(4),
      rawEthBalance: ethBalance,
      weiBalance: weiBigInt.toString(),
      blockNumber,
      fetchedAt: new Date().toISOString(),
      rpcSource: rpcUsed === PRIMARY_RPC ? 'PublicNode RPC' : '1RPC Fallback',
    });
  } catch (error: any) {
    console.error('Failed to query RPC native balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live on-chain balance from public EVM RPC node.' },
      { status: 502 }
    );
  }
}
