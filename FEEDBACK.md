# Uniswap Developer Feedback

## Project
**ChainPilot** — Read-Only Uniswap V3 LP Position & Risk Copilot

## What We Built
ChainPilot is a read-only decision-support copilot designed for Uniswap V3 concentrated liquidity providers (LPs). It queries live indexed Uniswap V3 NFT position data from The Graph Subgraph Gateway, normalizes tick boundaries and pool state, and applies pure deterministic mathematics to calculate position range state (`IN_RANGE`, `NEAR_LOWER`, `NEAR_UPPER`, `OUT_BELOW`, `OUT_ABOVE`), protocol grid geometry (fee %, tick spacing $\Delta t$, grid step bins $N_{\text{bins}}$), and a 0–100 LP RANGE RISK score. It presents these findings alongside data-grounded AI explanations, evidence citations, an interactive tick-drift simulator, and official Uniswap App linkouts (`app.uniswap.org/positions/v3/ethereum/{positionId}` and `app.uniswap.org/explore/pools/ethereum/{poolAddress}`).

## What Worked Well
- **Concentrated Liquidity Architecture**: The V3 tick range model $[t_{\text{lower}}, t_{\text{upper}}]$ provides an exceptionally clean mathematical foundation for deterministic risk modeling. Range width ($W = t_{\text{upper}} - t_{\text{lower}}$) and relative position ratio ($P = \frac{t_{\text{current}} - t_{\text{lower}}}{W}$) allow for precise, predictable status evaluations without relying on heuristic guesswork.
- **Protocol Parameter Consistency**: The deterministic mapping between fee tiers (`100`, `500`, `3000`, `10000`) and standard tick spacing ($\Delta t \in \{1, 10, 60, 200\}$) enabled us to compute exact protocol grid intervals ($N_{\text{bins}} = W / \Delta t$) directly from verified pool data.
- **Deep Link Patterns**: The official Uniswap web application URL structures (`app.uniswap.org/positions/v3/ethereum/{tokenId}` and `app.uniswap.org/explore/pools/ethereum/{poolAddress}`) made it straightforward to provide clean, read-only external navigation for LPs to inspect or manage positions safely on Uniswap's interface.

## Developer Experience
- **Understanding Tick Math**: Converting raw pool ticks ($t$) into intuitive human-readable range representations and boundary proximity percentages required careful handling of logarithmic tick-to-price dynamics ($\text{price} = 1.0001^t$).
- **Data Indexing Necessity**: Scanning unindexed RPC logs across historical blocks to discover an address's active `NonfungiblePositionManager` NFTs would be unfeasible for a real-time web application. Relying on indexed GraphQL queries via The Graph made position discovery fast and scalable.

## Challenges / Friction
- **Accrued Swap Fee Quantifications**: Uncollected swap fees in Uniswap V3 are not directly stored as simple static attributes on position entities; computing exact pending fees requires reading tick bitmaps or contract getters (`feeGrowthInside0LastX128` / `feeGrowthInside1LastX128`). Because of this, our read-only indexer pipeline focuses strictly on verified range state and liquidity activation rather than manufacturing estimated fee accruals.
- **Tick Spacing Alignment & Boundary Resolution**: LPs often select boundaries that snap to protocol tick spacing steps. Explaining why bounds snap to intervals of 10, 60, or 200 ticks required explicit protocol geometry calculations ($N_{\text{bins}} = W / \Delta t$) so users understand grid resolution differences across 0.05%, 0.3%, and 1.0% fee tier pools.

## Documentation / Developer Resources
- **Clear Protocol Concepts**: The core mathematical principles of Uniswap V3 concentrated liquidity (ticks, $L$, $\sqrt{P}$, range bounds) are well-documented in the Uniswap V3 Whitepaper and official documentation.
- **Opportunities for Analytics Builders**: For developers building read-only analytical, risk monitoring, or dashboard tools (rather than execution smart contracts), documentation around deep-linking patterns, tick spacing grid mechanics, and position NFT metadata schemas could be consolidated into a dedicated "Analytics & Read-Only Integrations" developer guide.

## What Could Be Improved
- **Standardized Read-Only Query Examples**: Official code samples showing standard GraphQL patterns for position discovery, pool state normalization, and tick range mapping would accelerate development for analytics and portfolio tool builders.
- **Explicit Fee Tier & Spacing Reference Utilities**: A lightweight, standalone TypeScript helper library for standard V3 math (e.g. tick to price conversion, fee tier to tick spacing lookup, grid bin calculation) would reduce boilerplate for off-chain and frontend developers.

## What We Would Like to See
- Official open-source TypeScript SDK helpers specifically tailored for **read-only analytics and monitoring tools** (e.g. range ratio calculation, boundary proximity helpers).
- Canonical documentation mapping official Uniswap Interface deep-link routes (`app.uniswap.org/explore/...` and `app.uniswap.org/positions/...`) across mainnet and L2 networks.
- Pre-built UI visualizer primitives (like lightweight SVG range charts) for embedding Uniswap V3 tick range health indicators in third-party dashboards.

## Relevant ChainPilot Code
All Uniswap V3 data handling and range math in ChainPilot are open-source and modular:
- [`lib/graph/client.ts`](https://github.com/R1shabhCodes/ChainPilot/blob/main/lib/graph/client.ts) — Live GraphQL position discovery via The Graph Subgraph Gateway.
- [`lib/graph/types.ts`](https://github.com/R1shabhCodes/ChainPilot/blob/main/lib/graph/types.ts) — Raw Subgraph schemas and normalized position data contracts.
- [`lib/decision/rangeGeometry.ts`](https://github.com/R1shabhCodes/ChainPilot/blob/main/lib/decision/rangeGeometry.ts) — Pure deterministic calculation of range width ($W$) and relative position ratio ($P$).
- [`lib/decision/riskCalculator.ts`](https://github.com/R1shabhCodes/ChainPilot/blob/main/lib/decision/riskCalculator.ts) — Pure deterministic 0–100 LP RANGE RISK score calculator.
- [`lib/decision/protocolGeometry.ts`](https://github.com/R1shabhCodes/ChainPilot/blob/main/lib/decision/protocolGeometry.ts) — Fee tier percentage, protocol tick spacing ($\Delta t$), and grid interval ($N_{\text{bins}}$) calculator.
- [`app/api/analyze/route.ts`](https://github.com/R1shabhCodes/ChainPilot/blob/main/app/api/analyze/route.ts) — Server route orchestrating verified Graph data, deterministic math, and AI explanation.
- [`app/components/LiquidityRangeVisualizer.tsx`](https://github.com/R1shabhCodes/ChainPilot/blob/main/app/components/LiquidityRangeVisualizer.tsx) — Position tick range visualizer and interactive tick drift simulator.
- [`lib/utils/explorer.ts`](https://github.com/R1shabhCodes/ChainPilot/blob/main/lib/utils/explorer.ts) — Official Uniswap web app deep-link generators and Etherscan contract helpers.
