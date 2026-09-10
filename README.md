# ChainPilot 🧭

> **AI-Assisted DeFi Position & Risk Copilot for Uniswap V3 Liquidity Providers**

ChainPilot is a read-only decision-support copilot designed specifically for **Uniswap V3 concentrated liquidity providers (LPs)**. It translates complex on-chain position telemetry, tick boundary geometry, and indexer data into plain-English risk evaluations, deterministic decision considerations, and verifiable protocol provenance.

ChainPilot is **not an autonomous trading bot** and **does not execute transactions or modify wallet state**. The user remains 100% in control of all liquidity decisions.

---

## 🏛️ Core Product Architecture & System Journey

ChainPilot operates on a strict **4-layer architectural boundary**. Blockchain facts originate from server-verified data providers, mathematical ranges are computed deterministically without AI, and AI acts strictly as an explanation layer.

```
                  ┌─────────────────────────────────────────┐
                  │       Public Ethereum Address           │
                  │   (Connected Privy Wallet or Manual)    │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
 ┌──────────────────────────────────────────────────────────────────────────┐
 │ LAYER 1 — VERIFIED DATA LAYER                                           │
 │ The Graph Subgraph Gateway (Deployment: 5zvR82QoaXY...)                 │
 │ • Fetches active Uniswap V3 NFT liquidity positions (liquidity > 0)     │
 │ • Retrieves tickLower, tickUpper, pool tick, feeTier, token contracts   │
 │ • Includes Subgraph Gateway Provenance & Query Audit Inspector          │
 └────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼
 ┌──────────────────────────────────────────────────────────────────────────┐
 │ LAYER 2 — DETERMINISTIC ENGINE LAYER                                     │
 │ Pure TypeScript Mathematics (lib/decision/)                              │
 │ • Range Geometry: Width W, Position Ratio P, Distance Percentages        │
 │ • Range State: IN_RANGE, OUT_BELOW, OUT_ABOVE, NEAR_LOWER, NEAR_UPPER    │
 │ • Protocol Geometry: Fee % (0.01%, 0.05%, 0.3%, 1.0%), Tick Spacing Δt,  │
 │   and Grid Step Bins (N_bins = W / Δt)                                   │
 │ • Decision Support: "WHAT SHOULD I CONSIDER?" (Neutral Considerations)   │
 └────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼
 ┌──────────────────────────────────────────────────────────────────────────┐
 │ LAYER 3 — DATA-GROUNDED AI EXPLANATION LAYER                            │
 │ Multi-Provider AI Engine (lib/ai/provider.ts)                            │
 │ • Primary: Groq API (openai/gpt-oss-120b) with Strict Schema Enforcement  │
 │ • Fallback: Google Gemini API (models/gemini-3.6-flash)                  │
 │ • Offline Fallback: Deterministic narrative if AI APIs are unavailable   │
 │ • Outputs 2 Pillars: [WHAT I FOUND] (Facts) & [WHY IT MATTERS] (Impact)  │
 └────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼
 ┌──────────────────────────────────────────────────────────────────────────┐
 │ LAYER 4 — USER DECISION & EXTERNAL READ-ONLY NAVIGATION                  │
 │ • Non-prescriptive risk reviews and evidence citations                   │
 │ • Direct linkouts: [MANAGE ON UNISWAP] & [UNISWAP POOL INFO]              │
 │ • Direct linkouts: [NFT MANAGER CONTRACT] & [V3 FACTORY CONTRACT]        │
 │ • Read-Only Disclaimer: User executes external transactions if desired  │
 └──────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 The 4 Operational Layers Explained

### Layer 1: Verified Data Layer (The Graph Subgraph Gateway)
- **Position Discovery**: Queries indexed Uniswap V3 mainnet liquidity data via GraphQL. Using The Graph avoids the need to scan millions of historical ERC-721 transfer logs across RPC history to discover an address's position NFTs.
- **Deployment ID**: `5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV` (Uniswap V3 Mainnet Subgraph).
- **GraphQL Query**: Filtered for active positions (`owner == $address`, `liquidity > 0`).
- **Load-Bearing Provenance Panel**: Renders live Subgraph Gateway metrics in the UI, including HTTP status (`200 OK`), round-trip latency (ms), timestamp, indexed position count, sanitized endpoint URL, and an expandable raw GraphQL query document.
- **Key Safety**: Server-side API keys (`THE_GRAPH_API_KEY`) are completely masked in client payloads (`https://gateway.thegraph.com/api/[SUBGRAPH_KEY_CONFIGURED]/...`).

### Layer 2: Deterministic Analysis Layer (Range & Protocol Geometry)
ChainPilot runs pure deterministic TypeScript mathematics (**zero AI, zero network calls, zero hallucinations**):
- **Range Ratio ($P$)**: $P = \frac{t_{\text{current}} - t_{\text{lower}}}{t_{\text{upper}} - t_{\text{lower}}}$, measuring price location inside the range.
- **Proximity Heuristics**: Applies a $15\%$ boundary threshold to classify positions into `OUT_BELOW`, `OUT_ABOVE`, `NEAR_LOWER`, `NEAR_UPPER`, or `CENTERED`.
- **Protocol Geometry**:
  - Maps `feeTier` to exact fee percentage: `100` $\rightarrow 0.01\%$, `500` $\rightarrow 0.05\%$, `3000` $\rightarrow 0.3\%$, `10000` $\rightarrow 1.0\%$.
  - Derives standard Uniswap V3 tick step spacing ($\Delta t \in \{1, 10, 60, 200\}$).
  - Calculates total protocol grid step bins ($N_{\text{bins}} = \frac{W}{\Delta t}$).
- **"WHAT SHOULD I CONSIDER?" Engine**: Generates objective operational considerations without prescribing financial advice.

### Layer 3: Data-Grounded AI Explanation Layer
- **Multi-Provider Fallback**: 
  1. **Groq API** (`openai/gpt-oss-120b`) with native JSON Schema enforcement (`GROQ_STRUCTURED_OUTPUT_SCHEMA`).
  2. **Google Gemini API** (`models/gemini-3.6-flash`) with JSON mode.
  3. **Offline Deterministic Fallback**: Generates factual summaries if AI keys are unconfigured or rate-limited.
- **2-Pillar Structure**:
  - `whatIFound`: Factual summary of position state, pair, and boundaries.
  - `whyItMatters`: Practical consequences for swap fee accumulation and single-sided token inventory.
- **Strict Data Grounding Rules**: The AI system prompt strictly forbids claiming "0 swap fees", "locked tokens", "balanced 50/50 exposure", or unverified USD pricing/profitability.

### Layer 4: User Decision & External Read-Only Navigation
- ChainPilot **does not execute trades, rebalances, or token approvals**.
- Provides direct contextual buttons to external management interfaces:
  - `[MANAGE ON UNISWAP ↗]` $\rightarrow$ `https://app.uniswap.org/positions/v3/ethereum/{positionId}`
  - `[UNISWAP POOL INFO ↗]` $\rightarrow$ `https://app.uniswap.org/explore/pools/ethereum/{poolAddress}`
  - `[NFT MANAGER CONTRACT ↗]` $\rightarrow$ `https://etherscan.io/address/0xc36442b4a4522e871399cd717abdd847ab11fe88`
  - `[V3 FACTORY CONTRACT ↗]` $\rightarrow$ `https://etherscan.io/address/0x1f98431c8ad98523631ae4a59f267346ea31f984`

---

## 🎛️ Interactive Tick Drift Simulator

The **Tick Drift Simulator** (built into `LiquidityRangeVisualizer.tsx` and `AIRiskCard.tsx`) is an educational component that allows users to interactively test tick price movements:
- **Client-Side Simulation**: Drag the simulated current tick slider below, inside, or above the position's lower/upper boundaries.
- **Real-Time Deterministic Updates**: Watch how range ratio $P$, boundary distance percentages, range status (`IN_RANGE` / `OUT_OF_RANGE`), and decision state (`OUT_BELOW`, `NEAR_LOWER`, etc.) update dynamically.
- **Zero Network / AI Calls**: Runs purely in local component state to help LPs visualize why concentrated liquidity stops earning swap fees outside selected bounds.

---

## 🔒 Read-Only Safety & User Control

ChainPilot prioritizes user safety and read-only execution:
- ❌ **No Wallet Transactions**: ChainPilot never prompts users to sign transactions, rebalance funds, or approve ERC-20 allowances.
- ❌ **No Automated Swaps**: ChainPilot does not execute automated trades or swaps.
- ❌ **No Invented Financial Data**: ChainPilot does not manufacture fake PnL, fake portfolio valuations, or unverified fee claims.
- ✅ **Public Address Analysis**: Any public Ethereum address can be analyzed without connecting a wallet.
- ✅ **User in Full Control**: External links direct users to official Uniswap or Etherscan interfaces where users maintain full control over their own wallets.

---

## 🔑 Privy Integration

ChainPilot integrates **Privy** (`@privy-io/react-auth`) for streamlined wallet authentication UX:
- **Optional Wallet Connection**: Connecting a wallet via Privy is optional. Public wallet analysis works out-of-the-box for any address entered manually or via preset demo buttons.
- **Address Auto-Sync**: When a user connects a wallet via Privy, ChainPilot automatically syncs the connected address into the analysis workspace for 1-click evaluation.
- **Read-Only Scope**: Privy is used strictly for authentication and address synchronization. ChainPilot does not use Privy to sign transactions or move funds.

---

## 📚 Interactive `/learn` Educational Route

ChainPilot includes a comprehensive educational guide at `/learn` ([app/learn/page.tsx](file:///d:/ETH_Global/chainpilot/app/learn/page.tsx)):
- **12 Progressive Sections**: Teaches concentrated liquidity mechanics, tick boundaries, range drift, out-of-range fee loss, indexer query architecture, and AI risk evaluation boundaries.
- **3-Level Progressive Disclosure**: Users can toggle between **Beginner**, **Advanced**, and **Pro/Judge** detail levels depending on technical depth.

---

## 💻 Tech Stack

- **Framework**: Next.js `16.3.4` (App Router, React Server Components, Turbopack), React `19.2.8`, TypeScript `^5`
- **Styling**: Tailwind CSS `^4` with CSS Custom Variables (`panel-architecture`, `t-surface`, `t-bg`, `t-border`, `cyan-500`)
- **Data Indexing**: The Graph Subgraph Gateway (`5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`)
- **Blockchain Telemetry**: Native EVM JSON-RPC over PublicNode (`ethereum-rpc.publicnode.com`) / 1RPC (`1rpc.io/eth`) for native ETH balance verification
- **AI Providers**: Groq API (`openai/gpt-oss-120b`) primary, Google Gemini API (`models/gemini-3.6-flash`) fallback
- **Authentication**: Privy (`@privy-io/react-auth ^3.40.0`)

---

## 📁 Project Structure

```text
chainpilot/
├── app/
│   ├── api/
│   │   ├── analyze/                  # Main portfolio analysis route (Graph + AI provider orchestrator)
│   │   └── balance/                  # EVM JSON-RPC native ETH balance fetcher
│   ├── components/                   # UI presentation & interactive components
│   │   ├── AIRiskCard.tsx            # Dominant position card, protocol display & action links
│   │   ├── GraphProvenancePanel.tsx  # The Graph load-bearing transparency & query audit panel
│   │   ├── LiquidityRangeVisualizer.tsx # Range math & interactive tick simulator
│   │   ├── DashboardClient.tsx       # Workspace state coordinator & zero-position view
│   │   ├── AddressInput.tsx          # EVM address validator & preset demo buttons
│   │   ├── PrivyAuthButton.tsx       # Privy wallet connect & address auto-sync
│   │   └── LearnContent.tsx          # /learn progressive educational guide component
│   ├── learn/                        # Educational /learn route
│   ├── globals.css                   # Cyberpunk/tactical design tokens & theme variables
│   └── page.tsx                      # Server component root layout shell
├── lib/
│   ├── ai/                           # Multi-provider AI engine & prompt contracts
│   │   ├── provider.ts               # Groq -> Gemini -> Fallback evaluation engine
│   │   ├── prompts.ts                # System prompt & strict data-grounding rules
│   │   └── types.ts                  # Risk level, evidence, and response schema contracts
│   ├── decision/                     # Pure deterministic calculation engines
│   │   ├── decisionEngine.ts         # Layer 2 "WHAT SHOULD I CONSIDER?" decision engine
│   │   ├── protocolGeometry.ts       # Fee tier % & tick spacing step calculator
│   │   └── rangeGeometry.ts          # Pure range width W & relative ratio P calculator
│   ├── graph/                        # Live Subgraph Gateway client
│   │   ├── client.ts                 # fetchUniswapPositions() & performance tracker
│   │   └── types.ts                  # Raw & normalized Graph position schemas
│   └── utils/                        # Explorer link helpers & EVM address utilities
├── .env.example                      # Server-side API key configuration template
├── package.json                      # Project dependencies & scripts
└── README.md                         # Project documentation
```

---

## 🛠️ Local Environment Setup

### Prerequisites
- **Node.js**: 20+
- **npm**: 10+

### Step-by-Step Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/R1shabhCodes/ChainPilot.git
   cd chainpilot
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Configure your server-side API keys in `.env.local`:
   ```env
   # Groq AI Engine Key (Primary)
   GROQ_API_KEY="your_groq_api_key_here"
   GROQ_MODEL="openai/gpt-oss-120b"

   # Google Gemini API Key (Fallback)
   GEMINI_API_KEY="your_gemini_api_key_here"

   # The Graph Subgraph API Key
   THE_GRAPH_API_KEY="your_the_graph_api_key_here"

   # Privy Auth App ID (Client-visible)
   NEXT_PUBLIC_PRIVY_APP_ID="your_privy_app_id_here"
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:3000](http://localhost:3000).

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🧪 Demo & Test Addresses

For testing and demonstration, use these preset mainnet addresses:

- **3-Position Verified LP Demo Wallet**:
  `0x50ec05ade8280758e2077fcbc08d878d4aef79c3`
  - Position #1: UNI/WETH (0.3% fee, NFT #1)
  - Position #2: DAI/USDC (0.05% fee, NFT #5)
  - Position #3: USDC/USDT (0.05% fee, NFT #8)

- **Zero-Position Test Wallet**:
  `0x1111111111111111111111111111111111111111`
  - Demonstrates clean zero-position status, protocol contract links, and Subgraph audit panel execution.

---

## 🏆 Hackathon & Sponsor Integrations

- **The Graph**: Load-bearing indexer integration querying the official Uniswap V3 Mainnet Subgraph (`5zvR82Q...`) to discover active NFT positions via GraphQL. Includes live latency, status code, and raw query transparency.
- **Uniswap V3**: Deep structural integration calculating range ratio $P$, concentration width $W$, protocol fee tiers, standard tick step spacing ($\Delta t$), and protocol step bins ($N_{\text{bins}}$), with direct linkouts to official Uniswap pool and position interfaces.
- **Privy**: Integrated embedded wallet authentication layer providing seamless address auto-sync for public portfolio analysis.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
