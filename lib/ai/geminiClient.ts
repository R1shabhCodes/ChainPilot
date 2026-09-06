import { SYSTEM_PROMPT_DEFI_COPILOT, buildAnalysisUserPrompt } from './prompts';
import { PortfolioAnalysisResponse } from './types';

const GEMINI_MODEL = 'models/gemini-3.6-flash';

export async function evaluatePositionsWithGemini(
  walletAddress: string,
  verifiedPositionsJson: string
): Promise<PortfolioAnalysisResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server environment.');
  }

  const userPrompt = buildAnalysisUserPrompt(walletAddress, verifiedPositionsJson);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

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
      temperature: 0.2, // Low temperature for deterministic evaluation
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    next: { revalidate: 0 }, // Do not cache AI evaluations
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API Error Response:', response.status);
    throw new Error(`Gemini API returned HTTP status ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Gemini API returned an empty completion response.');
  }

  try {
    const parsed: PortfolioAnalysisResponse = JSON.parse(rawText);
    return parsed;
  } catch (err) {
    console.error('Failed to parse Gemini JSON output:', err);
    throw new Error('Gemini API response did not conform to valid JSON format.');
  }
}
