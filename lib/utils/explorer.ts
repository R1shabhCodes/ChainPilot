// ChainPilot Explorer Link Helper Utilities

export const UNISWAP_V3_POSITION_MANAGER_ADDRESS = '0xc36442b4a4522e871399cd717abdd847ab11fe88';

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

export function shortenAddress(address: string, leading = 6, trailing = 4): string {
  if (!address || address.length < leading + trailing) return address;
  return `${address.slice(0, leading)}...${address.slice(-trailing)}`;
}
