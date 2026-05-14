import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { memberId } = await req.json() as { memberId: string };

  if (!memberId) {
    return NextResponse.json({ error: 'memberId is required' }, { status: 400 });
  }

  // Get the member to find their tenant
  const { data: member } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', memberId)
    .single();

  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }

  // Verify caller is tenant owner or admin
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('id', member.tenant_id)
    .eq('user_id', user.id)
    .single();

  if (!tenant) {
    // Check if they're an admin
    const { data: adminMembership } = await supabase
      .from('team_members')
      .select('role')
      .eq('tenant_id', member.tenant_id)
      .eq('user_id', user.id)
      .eq('status', 'accepted')
      .in('role', ['owner', 'admin'])
      .single();

    if (!adminMembership) {
      return NextResponse.json({ error: 'Only owners and admins can remove members' }, { status: 403 });
    }
  }

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', memberId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: 'removed' });
}
