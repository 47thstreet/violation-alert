import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { lookupKnowledgeBase } from '@/lib/knowledge-base/lookup';
import { researchViolation } from '@/lib/knowledge-base/ai-research';
import type { ViolationAgency } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { violation_type, violation_code, agency } = body as {
      violation_type: string;
      violation_code?: string | null;
      agency: ViolationAgency;
    };

    if (!violation_type || !agency) {
      return NextResponse.json(
        { error: 'violation_type and agency are required' },
        { status: 400 },
      );
    }

    const supabase = await createServerSupabaseClient();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check KB first
    const existing = await lookupKnowledgeBase(supabase, violation_type, agency);
    if (existing) {
      return NextResponse.json({ data: existing, source: 'cache' });
    }

    // Run AI research via NVIDIA Nemotron
    let research;
    try {
      research = await researchViolation(violation_type, violation_code || null, agency);
    } catch (aiErr) {
      const msg = aiErr instanceof Error ? aiErr.message : String(aiErr);
      console.error('AI research failed:', msg);

      if (msg.includes('NVIDIA_API_KEY not set')) {
        return NextResponse.json(
          { error: 'AI service not configured. Set NVIDIA_API_KEY.' },
          { status: 503 },
        );
      }

      return NextResponse.json(
        { error: 'AI research failed. Please try again later.' },
        { status: 502 },
      );
    }

    // Store in KB for future lookups
    const { data: stored, error } = await supabase
      .from('violation_knowledge_base')
      .insert({
        violation_type,
        violation_code: violation_code || violation_type,
        agency,
        title: research.title,
        resolution_steps: research.resolution_steps,
        estimated_cost_min: research.estimated_cost_min,
        estimated_cost_max: research.estimated_cost_max,
        timeline_days: research.timeline_days,
        required_documents: research.required_documents,
        diy_difficulty: research.diy_difficulty,
        description: research.description,
        ai_generated: true,
        search_count: 1,
      })
      .select()
      .single();

    if (error) {
      // If insert fails (e.g., table doesn't exist yet), still return the research
      return NextResponse.json({ data: research, source: 'ai', stored: false });
    }

    return NextResponse.json({ data: stored, source: 'ai', stored: true });
  } catch (err) {
    console.error('Knowledge base research error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
