import type { ViolationAgency, DiyDifficulty, ResolutionStep } from '@/lib/supabase/types';

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

/**
 * Build a structured prompt for AI research on a violation type.
 * This will be sent to Claude API once wired up.
 */
export function buildResearchPrompt(
  violationType: string,
  violationCode: string | null,
  agency: ViolationAgency,
): string {
  return `You are a NYC building violation expert. Research the following violation and provide actionable resolution guidance.

Violation Type: ${violationType}
${violationCode ? `Violation Code: ${violationCode}` : ''}
Agency: ${agency} (${agencyFullName(agency)})

Respond in JSON with this exact structure:
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
 * Stub implementation of AI research.
 * Returns a placeholder result until Claude API is wired up.
 */
export async function researchViolation(
  violationType: string,
  _violationCode: string | null,
  agency: ViolationAgency,
): Promise<AIResearchResult> {
  // TODO: Replace with actual Claude API call using buildResearchPrompt()
  const stubs: Record<string, AIResearchResult> = {
    DOB: {
      title: `DOB Violation: ${violationType}`,
      resolution_steps: [
        { order: 1, instruction: 'Review the violation notice and identify the specific code section cited', estimated_time: '30 min' },
        { order: 2, instruction: 'Hire a licensed contractor or expediter if needed', estimated_time: '1-2 days' },
        { order: 3, instruction: 'Obtain any required permits from DOB NOW', estimated_time: '1-5 days' },
        { order: 4, instruction: 'Complete the corrective work', estimated_time: '1-2 weeks' },
        { order: 5, instruction: 'Schedule a DOB re-inspection', estimated_time: '1-2 weeks' },
        { order: 6, instruction: 'Submit a Certificate of Correction to DOB', estimated_time: '1 day' },
      ],
      estimated_cost_min: 500,
      estimated_cost_max: 5000,
      timeline_days: 30,
      required_documents: [
        'Certificate of Correction',
        'Proof of corrective work (photos, receipts)',
        'Licensed contractor documentation',
        'Relevant permits',
      ],
      diy_difficulty: 'moderate',
      description:
        'This DOB violation requires corrective action and a Certificate of Correction filing. Failure to address it may result in additional penalties and potential stop-work orders.',
    },
    HPD: {
      title: `HPD Violation: ${violationType}`,
      resolution_steps: [
        { order: 1, instruction: 'Read the violation notice to understand the specific housing code issue', estimated_time: '15 min' },
        { order: 2, instruction: 'Perform the required repair or maintenance', estimated_time: '1-5 days' },
        { order: 3, instruction: 'Document the completed work with dated photos', estimated_time: '30 min' },
        { order: 4, instruction: 'Request an HPD re-inspection or submit a certification of correction', estimated_time: '1-2 weeks' },
        { order: 5, instruction: 'Follow up to confirm the violation has been dismissed', estimated_time: '1 week' },
      ],
      estimated_cost_min: 200,
      estimated_cost_max: 3000,
      timeline_days: 21,
      required_documents: [
        'Certification of correction',
        'Photos of completed repairs',
        'Contractor receipts (if applicable)',
      ],
      diy_difficulty: 'easy',
      description:
        'HPD violations relate to housing maintenance code. Timely correction is important as HPD can pursue emergency repairs at the owner\'s expense for hazardous conditions.',
    },
    ECB: {
      title: `ECB Violation: ${violationType}`,
      resolution_steps: [
        { order: 1, instruction: 'Review the ECB hearing notice and penalty schedule', estimated_time: '30 min' },
        { order: 2, instruction: 'Gather evidence and documentation for your case', estimated_time: '1-3 days' },
        { order: 3, instruction: 'Attend the OATH/ECB hearing or submit a written response', estimated_time: '1 day' },
        { order: 4, instruction: 'If found liable, pay the penalty or set up a payment plan', estimated_time: '1 day' },
        { order: 5, instruction: 'Correct the underlying violation to prevent re-issuance', estimated_time: '1-4 weeks' },
      ],
      estimated_cost_min: 1000,
      estimated_cost_max: 25000,
      timeline_days: 60,
      required_documents: [
        'ECB hearing notice',
        'Evidence of compliance or correction',
        'Legal representation documentation (recommended)',
        'Payment receipts',
      ],
      diy_difficulty: 'hard',
      description:
        'ECB violations carry financial penalties adjudicated at OATH hearings. Responding promptly and attending hearings can significantly reduce fines.',
    },
  };

  // Simulate async delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return stubs[agency] || stubs.DOB;
}
