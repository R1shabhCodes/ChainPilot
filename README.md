# ChainPilot 🧭

> **AI-Powered DeFi Position Copilot & Risk Engine**

ChainPilot is an intelligent risk analysis engine and position copilot for Decentralized Finance (DeFi) protocols. Built to assist traders and liquidity providers (LPs), ChainPilot is designed to monitor position health, evaluate range risks, and suggest transparent corrective actions using live blockchain data and Google Gemini AI.

---

## 🏗️ Architecture & System Data Flow

ChainPilot follows a strict Server/Client architecture. The main landing page (`app/page.tsx`) remains a React Server Component (RSC) baseline, delegating client-side interactivity to `DashboardClient.tsx`.

```
               ┌──────────────────────────────┐
               │    User / Connected Wallet   │
               └──────────────┬───────────────┘
                              │
                              ▼
               ┌──────────────────────────────┐
               │   Privy Authentication UI    │ [Implemented]
               │  (PrivyProviderWrapper.tsx)  │
               └──────────────┬───────────────┘
                              │  (Auto-sync wallet address)
                              ▼
               ┌──────────────────────────────┐
               │   DashboardClient (Client)   │ [Implemented]
               └──────────────┬───────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Live EVM RPC     │ │ The Graph Data   │ │ Position Filter  │
│ Balance Fetcher  │ │ Indexer Pipeline │ │ Tabs Component   │
│ [Implemented]    │ │ [WIP / Blocked]  │ │ [Implemented]    │
└────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘
         │ (ETH Balance)      │ (Positions Payload)│
         │                    ▼                    │
         │         ┌──────────────────┐            │
         │         │ Server /api/     │            │
         │         │ analyze Route    │            │
         │         │ [Foundation]     │            │
         │         └──────────┬───────┘            │
         │                    │                    │
         │                    ▼                    │
         │         ┌──────────────────┐            │
         │         │ Gemini AI Engine │            │
         │         │ (models/gemini-  │            │
         │         │  3.6-flash)      │            │
         │         │ [Implemented]    │            │
         │         └──────────┬───────┘            │
         │                    │                    │
         └──────────┬─────────┴────────────────────┘
                    ▼
         ┌─────────────────────────────────────────┐
         │       AIRiskCard Presentation UI        │
         │      (Evidence Citations & Actions)     │
         │              [Implemented]              │
         └─────────────────────────────────────────┘
```

> **Note on Data Separation**: The live EVM RPC balance fetcher provides real-time ETH native balances and block numbers directly from public nodes. It does not generate LP position telemetry. The AI analysis engine is invoked only when verified protocol position payloads are supplied by the server backend.

---

## 🚦 Component Implementation Status

| Component | Status | Description / Path |
| :--- | :--- | :--- |
| **Next.js RSC Shell** | `Implemented` | `app/page.tsx` — Server component layout, dark mode aesthetic, background grid |
| **EVM Address Validation** | `Implemented` | `lib/utils/address.ts` — Native regex validation for 40-character hex EVM addresses |
| **Live EVM RPC Balance** | `Implemented` | `app/api/balance/route.ts` & `NativeBalanceCard.tsx` — Queries `eth_getBalance` & `eth_blockNumber` from PublicNode RPC with 1RPC fallback |
| **Privy Auth Integration** | `Implemented` | `PrivyProviderWrapper.tsx` & `PrivyAuthButton.tsx` — Embedded wallet onboarding with automatic address input sync |
| **AI Schemas & Prompts** | `Implemented` | `lib/ai/types.ts` & `lib/ai/prompts.ts` — Strict TypeScript contracts (`RiskLevel`, `EvidenceCitation`, `SuggestedAction`) and non-hallucinatory prompt guidance |
| **Server Gemini AI Engine** | `Implemented` | `lib/ai/geminiClient.ts` — Server-only native `fetch()` client calling `models/gemini-3.6-flash` |
| **Analysis API Foundation** | `Implemented` | `app/api/analyze/route.ts` — Validates addresses and enforces HTTP status 428 `DATA_SOURCE_UNAVAILABLE` when subgraph key is missing |
| **DashboardClient UI** | `Implemented` | `app/components/DashboardClient.tsx` — Client-side state coordinator for auth, balance, filter tabs, and AI card rendering |
| **Position Filter UI** | `Implemented` | `app/components/PositionFilterTabs.tsx` — Reusable filter tab state bar (`ALL`, `IN_RANGE`, `OUT_OF_RANGE`, `CRITICAL_RISK`) |
| **AI Risk Presentation Card** | `Implemented` | `app/components/AIRiskCard.tsx` — Pure presentation renderer for verified AI risk summaries and status notices |
| **UX Routing Boundaries** | `Implemented` | `app/error.tsx`, `app/loading.tsx`, `app/not-found.tsx` — Next.js UX fallback pages |
| **Subgraph Data Ingestion** | `Foundation / prepared` | `app/api/analyze/route.ts` — Architectural foundation ready to accept server-fetched subgraph position payloads |
| **The Graph Live Indexer** | `WIP / blocked` | Indexing pipeline designed; live subgraph querying is currently paused pending API key setup |
| **Transaction Execution** | `Planned` | One-click action approval modal and transaction sign-off via Privy scheduled for Phase 8 |

---

## 🛠️ Tech Stack & Dependencies

Examine exact versions from `package.json`:

- **Framework**: Next.js (`16.3.4`), React (`19.2.8`), React DOM (`19.2.8`), TypeScript (`^5`)
- **Styling**: Tailwind CSS (`^4`), `@tailwindcss/postcss` (`^4`)
- **Wallet Authentication**: `@privy-io/react-auth` (`^3.40.0`)
- **Blockchain Telemetry**: Native EVM JSON-RPC over public HTTPS endpoints (`https://ethereum-rpc.publicnode.com`, fallback: `https://1rpc.io/eth`)
- **AI Engine**: Google Gemini API (`models/gemini-3.6-flash`) via server-only native HTTP client (`lib/ai/geminiClient.ts`)

---

## ⚖️ Project Integrity & Zero-Fake-Data Policy

ChainPilot enforces a strict **Zero-Fake-Data policy**:
- **No Mocked Data**: We do not generate, hardcode, or render synthetic portfolio positions or fake risk scores.
- **No Synthetic AI Claims**: The Gemini AI client evaluates only verified position data passed from the server.
- **Explicit System Statuses**: When required data providers (such as The Graph indexer) are unconfigured, `/api/analyze` responds with HTTP status 428 (`DATA_SOURCE_UNAVAILABLE`), and the UI renders a clear status banner rather than fabricated analysis.

---

## 🚧 Limitations & Active Work in Progress

1. **The Graph Live Indexing**: On-chain subgraph querying is architected but paused while Studio API key access is established.
2. **AI Analysis Safeguards**: Gemini AI risk evaluation is gated behind server-verified data availability to ensure all recommendations remain evidence-backed.
3. **Transaction Execution**: User action sign-off via embedded Privy wallets is planned for upcoming development phases.

---

## 🚀 Environment Setup & Local Development

### Prerequisites

- Node.js 20+
- npm 10+

### Step-by-Step Setup

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
   Create `.env.local` using `.env.example` as a reference:
   ```bash
   cp .env.example .env.local
   ```
   Add your API keys to `.env.local`:
   ```env
   # Google Gemini API Key (Server-only)
   GEMINI_API_KEY="your_gemini_api_key_here"

   # Privy App ID (Client auth)
   NEXT_PUBLIC_PRIVY_APP_ID="your_privy_app_id_here"

   # The Graph API Key (Phase 3 Indexing)
   THE_GRAPH_API_KEY="your_the_graph_api_key_here"
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🤝 Sponsor & Integration Intent

- **The Graph**: Architected as the primary indexer for Uniswap v3 / DeFi liquidity pool positions.
- **Privy**: Integrated as the primary authentication and embedded wallet layer for user address auto-sync and future transaction authorization.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
