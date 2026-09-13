import { SYSTEM_PROMPT_DEFI_COPILOT, buildAnalysisUserPrompt } from './prompts';
import {
  PortfolioAnalysisResponse,
  PositionRiskSummary,
  ProviderStatusReport,
  ProviderStatusState,
  AIProviderName,
} from './types';
import { NormalizedPositionData } from '../graph/types';

const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-120b';
const DEFAULT_GEMINI_MODEL = 'models/gemini-3.6-flash';

const GROQ_STRUCTURED_OUTPUT_SCHEMA = {
  type: 'json_schema',
  json_schema: {
    name: 'portfolio_analysis',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        overallRiskScore: { type: 'number' },
        overallRiskLevel: { type: 'string', enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'UNKNOWN'] },
        summaryText: { type: 'string' },
        positionSummaries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              positionId: { type: 'string' },
              protocol: { type: 'string' },
              tokenPair: { type: 'string' },
              riskLevel: { type: 'string', enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'UNKNOWN'] },
              rangeStatus: { type: 'string', enum: ['IN_RANGE', 'OUT_OF_RANGE', 'UNKNOWN'] },
              whatIFound: { type: 'string' },
              whyItMatters: { type: 'string' },
              summary: { type: 'string' },
              evidence: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: { type: 'string' },
                    value: { type: 'string' },
                    sourceRef: { type: 'string' },
                  },
                  required: ['field', 'value', 'sourceRef'],
                  additionalProperties: false,
                },
              },
            },
            required: ['positionId', 'protocol', 'tokenPair', 'riskLevel', 'rangeStatus', 'whatIFound', 'whyItMatters', 'summary', 'evidence'],
            additionalProperties: false,
          },
        },
      },
      required: ['overallRiskScore', 'overallRiskLevel', 'summaryText', 'positionSummaries'],
      additionalProperties: false,
    },
  },
};

// Comprehensive schema validator for LLM JSON output
function validateAnalysisSchema(parsed: any): parsed is PortfolioAnalysisResponse {
  if (!parsed || typeof parsed !== 'object') return false;
  if (!Array.isArray(parsed.positionSummaries)) return false;

  for (const pos of parsed.positionSummaries) {
    if (typeof pos !== 'object' || !pos) return false;
    if (typeof pos.positionId !== 'string') return false;
    if (typeof pos.protocol !== 'string') return false;
    if (typeof pos.tokenPair !== 'string') return false;
    if (!['LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'UNKNOWN'].includes(pos.riskLevel)) return false;
    if (!['IN_RANGE', 'OUT_OF_RANGE', 'UNKNOWN'].includes(pos.rangeStatus)) return false;
    if (!Array.isArray(pos.evidence)) return false;

    // Ensure whatIFound and whyItMatters exist or populate fallback summary
    if (typeof pos.whatIFound !== 'string') pos.whatIFound = pos.summary || '';
    if (typeof pos.whyItMatters !== 'string') pos.whyItMatters = '';
    if (typeof pos.summary !== 'string') {
      pos.summary = `${pos.whatIFound} ${pos.whyItMatters}`.trim();
    }

    for (const ev of pos.evidence) {
      if (typeof ev !== 'object' || !ev) return false;
      if (typeof ev.field !== 'string') return false;
      if (typeof ev.value !== 'string') return false;
      if (typeof ev.sourceRef !== 'string') return false;
    }
  }
  return true;
}

import { calculatePortfolioRisk, calculatePositionRiskScore } from '../decision/riskCalculator';

function ensureAllPositionsSummarized(
  summaries: PositionRiskSummary[],
  normalizedPositions: NormalizedPositionData[]
): PositionRiskSummary[] {
  const summaryMap = new Map<string, PositionRiskSummary>();
  summaries.forEach((s) => summaryMap.set(s.positionId, s));

  const result: PositionRiskSummary[] = [];

  for (const pos of normalizedPositions) {
    const detRes = calculatePositionRiskScore(pos.tickLower, pos.tickUpper, pos.currentTick, pos.positionId);
    const existing = summaryMap.get(pos.positionId);
    if (existing) {
      result.push({
        ...existing,
        riskLevel: detRes.positionRiskLevel,
        tickLower: existing.tickLower ?? pos.tickLower,
        tickUpper: existing.tickUpper ?? pos.tickUpper,
        currentTick: existing.currentTick ?? pos.currentTick,
        poolAddress: existing.poolAddress || pos.poolAddress,
        token0Address: existing.token0Address || pos.token0Address,
        token1Address: existing.token1Address || pos.token1Address,
        feeTier: existing.feeTier || pos.feeTier,
      });
    } else {
      const whatIFound = `Position #${pos.positionId} (${pos.tokenPair}) is verified from indexed on-chain data. Its selected tick range is ${pos.tickLower.toLocaleString('en-US')} to ${pos.tickUpper.toLocaleString('en-US')} and current pool tick is ${pos.currentTick !== null ? pos.currentTick.toLocaleString('en-US') : 'N/A'}.`;
      const whyItMatters = `AI explanation unavailable. Deterministic analysis identifies this position as ${pos.rangeStatus === 'IN_RANGE' ? 'IN RANGE' : 'OUT OF RANGE'}.`;
      result.push({
        positionId: pos.positionId,
        protocol: pos.protocol,
        tokenPair: pos.tokenPair,
        riskLevel: detRes.positionRiskLevel,
        rangeStatus: pos.rangeStatus,
        whatIFound,
        whyItMatters,
        evidence: [
          { field: 'Current Tick', value: pos.currentTick !== null ? String(pos.currentTick) : 'N/A', sourceRef: 'Uniswap V3 Pool' },
          { field: 'Lower Tick', value: String(pos.tickLower), sourceRef: `NFT #${pos.positionId}` },
          { field: 'Upper Tick', value: String(pos.tickUpper), sourceRef: `NFT #${pos.positionId}` },
        ],
        summary: `${whatIFound} ${whyItMatters}`,
        tickLower: pos.tickLower,
        tickUpper: pos.tickUpper,
        currentTick: pos.currentTick,
        poolAddress: pos.poolAddress,
        token0Address: pos.token0Address,
        token1Address: pos.token1Address,
        feeTier: pos.feeTier,
      });
    }
  }

  return result;
}

export async function evaluatePortfolioWithProviders(
  walletAddress: string,
  verifiedPositionsJson: string,
  normalizedPositions: NormalizedPositionData[]
): Promise<PortfolioAnalysisResponse> {
  const groqApiKey = process.env.GROQ_API_KEY?.trim();
  const groqModel = process.env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL;

  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
  const geminiModel = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

  let groqStatus: ProviderStatusState = groqApiKey ? 'STANDBY' : 'DISABLED';
  let geminiStatus: ProviderStatusState = geminiApiKey ? 'STANDBY' : 'DISABLED';
  let details = '';

  // Calculate 100% deterministic LP Range Risk Score
  const deterministicRisk = calculatePortfolioRisk(normalizedPositions);
  const scoreInfoStr = `LP Range Risk Score: ${deterministicRisk.overallRiskScore}/100 (${deterministicRisk.overallRiskLevel} Risk Level). ${deterministicRisk.riskDescription}`;

  const userPrompt = buildAnalysisUserPrompt(walletAddress, verifiedPositionsJson, scoreInfoStr);

  // STEP 1: Attempt Primary Provider (Groq API using Structured Outputs)
  if (groqApiKey) {
    try {
      groqStatus = 'ACTIVE';
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: groqModel,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT_DEFI_COPILOT },
            { role: 'user', content: userPrompt },
          ],
          response_format: GROQ_STRUCTURED_OUTPUT_SCHEMA,
          temperature: 0.2,
        }),
        next: { revalidate: 0 },
      });

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        const rawContent = groqData.choices?.[0]?.message?.content;
        if (rawContent) {
          const parsed = JSON.parse(rawContent);
          if (validateAnalysisSchema(parsed)) {
            const completedSummaries = ensureAllPositionsSummarized(parsed.positionSummaries, normalizedPositions);
            return {
              address: walletAddress,
              overallRiskScore: deterministicRisk.overallRiskScore,
              overallRiskLevel: deterministicRisk.overallRiskLevel,
              riskDescription: deterministicRisk.riskDescription,
              aiStatus: 'SUCCESS',
              providerStatus: {
                groqStatus: 'ACTIVE',
                geminiStatus: geminiApiKey ? 'STANDBY' : 'DISABLED',
                activeProvider: 'GROQ',
                details: `Analyzed via Groq Structured Outputs (${groqModel})`,
              },
              positionSummaries: completedSummaries,
              analyzedAt: new Date().toISOString(),
              summaryText: parsed.summaryText || 'Portfolio analyzed successfully via Groq.',
            };
          }
        }
      } else {
        if (groqRes.status === 429) {
          groqStatus = 'RATE_LIMITED';
        } else {
          groqStatus = 'UNAVAILABLE';
        }
        details += `Groq HTTP ${groqRes.status}. `;
      }
    } catch (err: any) {
      groqStatus = 'UNAVAILABLE';
      details += `Groq error: ${err.message || err}. `;
    }
  }

  // STEP 2: Fallback to Secondary Provider (Gemini API - exact verified format)
  if (geminiApiKey) {
    try {
      geminiStatus = 'ACTIVE';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/${geminiModel}:generateContent?key=${geminiApiKey}`;

      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }],
          },
        ],
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT_DEFI_COPILOT }],
        },
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      };

      const geminiRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        next: { revalidate: 0 },
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (validateAnalysisSchema(parsed)) {
            const completedSummaries = ensureAllPositionsSummarized(parsed.positionSummaries, normalizedPositions);
            return {
              address: walletAddress,
              overallRiskScore: deterministicRisk.overallRiskScore,
              overallRiskLevel: deterministicRisk.overallRiskLevel,
              riskDescription: deterministicRisk.riskDescription,
              aiStatus: 'SUCCESS',
              providerStatus: {
                groqStatus,
                geminiStatus: 'ACTIVE',
                activeProvider: 'GEMINI',
                details: `Analyzed via Gemini Fallback (${geminiModel})`,
              },
              positionSummaries: completedSummaries,
              analyzedAt: new Date().toISOString(),
              summaryText: parsed.summaryText || 'Portfolio analyzed successfully via Gemini fallback.',
            };
          }
        }
      } else {
        if (geminiRes.status === 429) {
          geminiStatus = 'RATE_LIMITED';
        } else {
          geminiStatus = 'UNAVAILABLE';
        }
        details += `Gemini HTTP ${geminiRes.status}. `;
      }
    } catch (err: any) {
      geminiStatus = 'UNAVAILABLE';
      details += `Gemini error: ${err.message || err}. `;
    }
  }

  // STEP 3: Both AI Providers Failed or Unavailable -> Deterministic Fallback Response
  const fallbackSummaries: PositionRiskSummary[] = normalizedPositions.map((pos) => {
    const detRes = calculatePositionRiskScore(pos.tickLower, pos.tickUpper, pos.currentTick, pos.positionId);
    const whatIFound = `Position #${pos.positionId} (${pos.tokenPair}) is verified from indexed on-chain data. Its selected tick range is ${pos.tickLower.toLocaleString('en-US')} to ${pos.tickUpper.toLocaleString('en-US')} and current pool tick is ${pos.currentTick !== null ? pos.currentTick.toLocaleString('en-US') : 'N/A'}.`;
    const whyItMatters = `AI explanation unavailable. Deterministic analysis identifies this position as ${pos.rangeStatus === 'IN_RANGE' ? 'IN RANGE' : 'OUT OF RANGE'}. ${pos.rangeStatus === 'IN_RANGE' ? 'Liquidity is active within selected bounds and earning swap fees.' : 'No new swap fees are collected while the position remains inactive outside bounds.'}`;

    return {
      positionId: pos.positionId,
      protocol: pos.protocol,
      tokenPair: pos.tokenPair,
      riskLevel: detRes.positionRiskLevel,
      rangeStatus: pos.rangeStatus,
      whatIFound,
      whyItMatters,
      evidence: [
        { field: 'Current Tick', value: pos.currentTick !== null ? String(pos.currentTick) : 'N/A', sourceRef: 'Uniswap V3 Pool' },
        { field: 'Lower Tick', value: String(pos.tickLower), sourceRef: `NFT #${pos.positionId}` },
        { field: 'Upper Tick', value: String(pos.tickUpper), sourceRef: `NFT #${pos.positionId}` },
      ],
      summary: `${whatIFound} ${whyItMatters}`,
      tickLower: pos.tickLower,
      tickUpper: pos.tickUpper,
      currentTick: pos.currentTick,
      poolAddress: pos.poolAddress,
      token0Address: pos.token0Address,
      token1Address: pos.token1Address,
      feeTier: pos.feeTier,
    };
  });

  return {
    address: walletAddress,
    overallRiskScore: deterministicRisk.overallRiskScore,
    overallRiskLevel: deterministicRisk.overallRiskLevel,
    riskDescription: deterministicRisk.riskDescription,
    aiStatus: 'UNAVAILABLE',
    providerStatus: {
      groqStatus,
      geminiStatus,
      activeProvider: 'NONE',
      details: details.trim() || 'AI interpretation engines currently unavailable.',
    },
    positionSummaries: fallbackSummaries,
    analyzedAt: new Date().toISOString(),
    summaryText: `On-chain position data verified. ${deterministicRisk.riskDescription} AI natural language interpretation is currently unavailable.`,
  };
}
