# ChainPilot 🧭

> **AI-Powered DeFi Position Copilot & Risk Engine**

ChainPilot is an intelligent, evidence-backed risk analysis engine and position copilot for Decentralized Finance (DeFi) protocols. Built for traders and liquidity providers (LPs), ChainPilot helps monitor position health, calculate impermanent loss risk, and suggest corrective actions using real-time blockchain telemetry and Google Gemini AI.

---

## 🏗️ Current Architecture & System Data Flow

ChainPilot enforces strict separation of concerns, keeping `app/page.tsx` as a React Server Component (RSC) while managing client-side interactive state inside `DashboardClient.tsx`.

```
               ┌──────────────────────────────┐
               │    User / Connected Wallet   │
               └──────────────┬───────────────┘
                              │
                              ▼
               ┌──────────────────────────────┐
               │   Privy Authentication UI    │
               │  (PrivyProviderWrapper.tsx)  │
               └──────────────┬───────────────┘
                              │  (Auto-sync wallet address)
                              ▼
               ┌──────────────────────────────┐
               │   DashboardClient (Client)   │
               └──────────────┬───────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ EVM RPC Balance  │ │ The Graph Data   │ │ Position Filter  │
│ Fetcher (Live)   │ │ (Paused / WIP)   │ │ Tabs (ALL/RANGE) │
└────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘
         │                    │                    │
         └──────────┬─────────┘                    │
                    ▼                              │
         ┌──────────────────┐                      │
         │ Server /api/     │                      │
         │ analyze Route    │                      │
         └──────────┬───────┘                      │
                    │                              │
                    ▼                              │
         ┌──────────────────┐                      │
         │ Gemini 3.6 Flash │                      │
         │ AI Engine Client │                      │
         └──────────┬───────┘                      │
                    │                              │
                    ▼                              │
         ┌─────────────────────────────────────────┴┐
         │       AIRiskCard Presentation UI         │
         │    (Evidence Citations & Actions)        │
         └──────────────────────────────────────────┘
```

### Component Status Breakdown

| Component | Status | Details |
| :--- | :--- | :--- |
| **Next.js RSC Shell** | ✅ Implemented | Server Component layout (`app/page.tsx`), header, background, metadata |
| **Privy Auth Integration** | ✅ Implemented | Embedded wallet login, modal triggers, and automatic address population |
| **Live EVM RPC Balance** | ✅ Implemented | Real-time `eth_getBalance` queries over public Ethereum RPC endpoints |
| **Position Filter UI** | ✅ Implemented | Filter state tabs (`ALL`, `IN_RANGE`, `OUT_OF_RANGE`, `CRITICAL_RISK`) |
| **AI Risk Card UI** | ✅ Implemented | Reusable presentation renderer for verified AI risk summaries |
| **Gemini AI Client** | ✅ Implemented | Server-only native `fetch()` integration with `models/gemini-3.6-flash` |
| **Analysis API Foundation** | ✅ Implemented | Secure `/api/analyze` route returning `HTTP 428 DATA_SOURCE_UNAVAILABLE` when data is missing |
| **The Graph Live Indexer** | ⏳ Paused (WIP) | Data fetching pipeline architected; live querying paused pending API key configuration |
| **Transaction Sign-off** | ⏳ Planned (WIP) | Action approval modal and transaction sign-off pipeline scheduled for Phase 8 |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components + Client Boundaries), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Vanilla CSS design tokens
- **Wallet Auth**: `@privy-io/react-auth` (Privy embedded wallets)
- **Blockchain Data**: Native EVM JSON-RPC via public Ethereum endpoints (`ethereum-rpc.publicnode.com`)
- **AI Intelligence**: Google Gemini API (`models/gemini-3.6-flash`) via server-only native fetch client (`lib/ai/geminiClient.ts`)
- **Indexing & Queries**: The Graph Subgraph APIs (Integration architected, live queries paused)

---

## ✨ Implemented Features

- **Standardized AI Schemas & Prompts**: `lib/ai/types.ts` defines explicit contracts for `RiskLevel`, `RangeStatus`, `EvidenceCitation`, `SuggestedAction`, `PositionRiskSummary`, and `PortfolioAnalysisResponse`. `lib/ai/prompts.ts` enforces non-hallucinatory system prompts.
- **Server-Only Gemini AI Engine**: `lib/ai/geminiClient.ts` executes server-side calls directly to Google Gemini API endpoints without third-party SDK dependencies or client key exposure.
- **Live Ethereum Native Balance Fetcher**: `/api/balance/route.ts` and `NativeBalanceCard.tsx` fetch and render live ETH balances and block heights directly from public EVM RPC nodes.
- **Privy Wallet Authentication**: Seamless embedded wallet onboarding and manual address input sync.
- **Position Filter UI**: Interactive state selector (`ALL`, `IN_RANGE`, `OUT_OF_RANGE`, `CRITICAL_RISK`) built for immediate connection to real indexed position streams.
- **AI Risk Presentation Renderer**: `AIRiskCard.tsx` renders evidence citations, risk levels, and suggested actions exclusively from verified server responses.
- **Error & Loading Infrastructure**: Full UX boundary support via `app/error.tsx`, `app/loading.tsx`, and `app/not-found.tsx`.

---

## 🚧 Current Limitations & Work in Progress

1. **The Graph Live Indexing**: On-chain position indexing is architected but currently paused until The Graph Studio API key configuration is finalized. The analysis route `/api/analyze` strictly enforces `HTTP 428 DATA_SOURCE_UNAVAILABLE` rather than returning mock data.
2. **AI Analysis Safeguards**: ChainPilot's Gemini AI pipeline rejects requests that lack verified position data, preventing hallucinated portfolio evaluations.
3. **Transaction Execution**: One-click action execution (e.g. rebalancing LP ranges) will be connected to Privy wallet transaction sign-off in an upcoming release.

---

## ⚖️ Project Integrity & Zero-Fake-Data Guarantee

ChainPilot operates under a strict **Zero-Fake-Data policy**:
- **No Mock Data**: We do not use hardcoded, sample, or fabricated portfolio data.
- **No Synthetic AI Output**: AI risk analysis is generated only when backed by verified on-chain telemetry.
- **Transparent Statuses**: When external data sources (like subgraph endpoints) are unconfigured, the UI clearly displays explicit system banners rather than synthetic metrics.

---

## 🚀 Environment Setup & Local Development

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/R1shabhCodes/ChainPilot.git
   cd chainpilot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Configuration:
   Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Add your API keys to `.env.local`:
   ```env
   # Google Gemini API Key
   GEMINI_API_KEY="your_gemini_api_key_here"

   # Privy App ID (Optional for wallet login)
   NEXT_PUBLIC_PRIVY_APP_ID="your_privy_app_id_here"

   # The Graph API Key (Phase 3)
   THE_GRAPH_API_KEY="your_the_graph_api_key_here"
   ```

4. Run Development Server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Run Production Build:
   ```bash
   npm run build
   ```

---

## 🤝 Sponsor & Integration Alignment

- **The Graph**: Intended as the load-bearing position indexing engine for Uniswap v3 / DeFi liquidity positions. Integration pipeline is architected; live subgraph queries are pending API key activation.
- **Privy**: Load-bearing authentication and embedded wallet layer, providing low-friction wallet connection and transaction authorization.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
