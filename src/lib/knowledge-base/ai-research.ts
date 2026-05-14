import type { ViolationAgency, DiyDifficulty, ResolutionStep } from '@/lib/supabase/types';

// ── NVIDIA API Config ──────────────────────────────────────────────
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_MODEL = 'nvidia/llama-3.3-nemotron-super-49b-v1';
const NVIDIA_TIMEOUT_MS = 30_000;

export interface AIResearchResult {
  title: string;
  resolution_steps: ResolutionStep[];
  estimated_cost_min: number;
  estimated_cost_max: number;
  timeline_days: number;
  required_documents: string[];
  diy_difficulty: DiyDifficulty;
  description: string;
}

function agencyFullName(agency: ViolationAgency): string {
  const names: Record<ViolationAgency, string> = {
    DOB: 'Department of Buildings',
    HPD: 'Housing Preservation & Development',
    ECB: 'Environmental Control Board',
    DEP: 'Department of Environmental Protection',
    FDNY: 'Fire Department of New York',
    DSNY: 'Department of Sanitation',
  };
  return names[agency];
}

/**
 * Build a structured prompt for AI research on a violation type.
 */
export function buildResearchPrompt(
  violationType: string,
  violationCode: string | null,
  agency: ViolationAgency,
  description?: string,
): string {
  return `You are a NYC building violation expert. Research the following violation and provide actionable resolution guidance.

Violation Type: ${violationType}
${violationCode ? `Violation Code: ${violationCode}` : ''}
Agency: ${agency} (${agencyFullName(agency)})
${description ? `Description: ${description}` : ''}

Respond in JSON with this exact structure (no markdown, no text outside JSON):
{
  "title": "Short title for this violation type",
  "resolution_steps": [{"order": 1, "instruction": "...", "estimated_time": "1 hour"}, ...],
  "estimated_cost_min": <number in USD>,
  "estimated_cost_max": <number in USD>,
  "timeline_days": <typical days to resolve>,
  "required_documents": ["Document 1", "Document 2"],
  "diy_difficulty": "easy" | "moderate" | "hard" | "professional_only",
  "description": "Brief explanation of what this violation means and why it matters"
}

Be specific to NYC regulations and processes. Include any relevant NYC DOB/HPD/ECB filing requirements.`;
}

/**
 * Call NVIDIA Nemotron API (same pattern as tools/remedy.ts).
 */
async function callNvidia(prompt: string): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY not set. Get a free key at https://build.nvidia.com');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), NVIDIA_TIMEOUT_MS);

  try {
    const res = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert NYC building violations consultant. You know DOB, HPD, ECB, DEP, FDNY, and DSNY regulations inside and out. You provide specific, actionable remediation steps for NYC property owners. Always respond in valid JSON only — no markdown, no explanation text outside the JSON.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`NVIDIA API error ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Parse JSON from AI response, stripping markdown fences if present.
 */
function parseAIResponse(raw: string): AIResearchResult {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const parsed = JSON.parse(cleaned);

  // Validate and coerce the diy_difficulty to an allowed value
  const validDifficulties: DiyDifficulty[] = ['easy', 'moderate', 'hard', 'professional_only'];
  if (!validDifficulties.includes(parsed.diy_difficulty)) {
    parsed.diy_difficulty = 'moderate';
  }

  // Ensure resolution_steps have proper structure
  if (Array.isArray(parsed.resolution_steps)) {
    parsed.resolution_steps = parsed.resolution_steps.map((step: Record<string, unknown>, i: number) => ({
      order: step.order ?? i + 1,
      instruction: step.instruction ?? String(step),
      estimated_time: step.estimated_time ?? 'varies',
    }));
  } else {
    parsed.resolution_steps = [];
  }

  return {
    title: parsed.title || 'Unknown Violation',
    resolution_steps: parsed.resolution_steps,
    estimated_cost_min: Number(parsed.estimated_cost_min) || 0,
    estimated_cost_max: Number(parsed.estimated_cost_max) || 0,
    timeline_days: Number(parsed.timeline_days) || 30,
    required_documents: Array.isArray(parsed.required_documents) ? parsed.required_documents : [],
    diy_difficulty: parsed.diy_difficulty,
    description: parsed.description || '',
  };
}

/**
 * Research a violation type using NVIDIA Nemotron AI.
 * Falls back to a minimal stub if the API key is missing or the call fails.
 */
export async function researchViolation(
  violationType: string,
  violationCode: string | null,
  agency: ViolationAgency,
  description?: string,
): Promise<AIResearchResult> {
  // Build the prompt
  const prompt = buildResearchPrompt(violationType, violationCode, agency, description);

  try {
    const raw = await callNvidia(prompt);
    return parseAIResponse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[ai-research] NVIDIA API call failed: ${message}`);

    // If API key is missing, return fallback instead of crashing
    // The fallback gives basic guidance; real AI gives detailed remedies

    // For transient errors (timeout, rate limit, etc.), return a fallback
    return {
      title: `${agency} Violation: ${violationType}`,
      resolution_steps: [
        { order: 1, instruction: 'Review the violation notice carefully', estimated_time: '30 min' },
        { order: 2, instruction: `Contact ${agency} (${agencyFullName(agency)}) for specific resolution guidance`, estimated_time: '1 day' },
        { order: 3, instruction: 'Complete required corrective action', estimated_time: 'varies' },
        { order: 4, instruction: 'Submit proof of correction to the issuing agency', estimated_time: '1 day' },
      ],
      estimated_cost_min: 0,
      estimated_cost_max: 0,
      timeline_days: 30,
      required_documents: ['Violation notice', 'Proof of correction'],
      diy_difficulty: 'moderate',
      description: `AI research temporarily unavailable. Contact ${agency} directly for detailed guidance on this violation type.`,
    };
  }
}
