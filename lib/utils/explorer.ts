// ChainPilot Explorer Link Helper Utilities

export const UNISWAP_V3_POSITION_MANAGER_ADDRESS = '0xc36442b4a4522e871399cd717abdd847ab11fe88';
export const UNISWAP_V3_FACTORY_ADDRESS = '0x1f98431c8ad98523631ae4a59f267346ea31f984';

export function getEtherscanAddressUrl(address: string): string {
  return `https://etherscan.io/address/${address}`;
}

export function getEtherscanNftUrl(tokenId: string | number): string {
  return `https://etherscan.io/nft/${UNISWAP_V3_POSITION_MANAGER_ADDRESS}/${tokenId}`;
}

export function getEtherscanTokenUrl(tokenAddress: string): string {
  return `https://etherscan.io/token/${tokenAddress}`;
}

export function getEtherscanPoolUrl(poolAddress: string): string {
  return `https://etherscan.io/address/${poolAddress}`;
}

export function getEtherscanFactoryUrl(): string {
  return `https://etherscan.io/address/${UNISWAP_V3_FACTORY_ADDRESS}`;
}

export function getEtherscanNftManagerUrl(): string {
  return `https://etherscan.io/address/${UNISWAP_V3_POSITION_MANAGER_ADDRESS}`;
}

export function getUniswapPoolUrl(poolAddress?: string): string {
  if (!poolAddress) return 'https://app.uniswap.org/explore/pools/ethereum';
  return `https://app.uniswap.org/explore/pools/ethereum/${poolAddress}`;
}

export function getUniswapPositionUrl(tokenId?: string | number): string {
  if (!tokenId) return 'https://app.uniswap.org/positions';
  return `https://app.uniswap.org/positions/v3/ethereum/${tokenId}`;
}

export function shortenAddress(address: string, leading = 6, trailing = 4): string {
  if (!address || address.length < leading + trailing) return address;
  return `${address.slice(0, leading)}...${address.slice(-trailing)}`;
}

