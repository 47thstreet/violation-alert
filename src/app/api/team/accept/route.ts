import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { inviteId, action } = await req.json() as { inviteId: string; action: 'accept' | 'reject' };

  if (!inviteId || !action) {
    return NextResponse.json({ error: 'inviteId and action are required' }, { status: 400 });
  }

  // Find the invite for this user's email
  const { data: invite } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', inviteId)
    .eq('invited_email', user.email?.toLowerCase() ?? '')
    .eq('status', 'pending')
    .single();

  if (!invite) {
    return NextResponse.json({ error: 'Invite not found or already processed' }, { status: 404 });
  }

  if (action === 'accept') {
    const { error } = await supabase
      .from('team_members')
      .update({
        user_id: user.id,
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', inviteId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'accepted' });
  } else {
    const { error } = await supabase
      .from('team_members')
      .update({ status: 'rejected' })
      .eq('id', inviteId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'rejected' });
  }
}
