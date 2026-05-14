import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { TeamRole } from '@/lib/supabase/types';

export async function PATCH(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { memberId, role } = await req.json() as { memberId: string; role: TeamRole };

  if (!memberId || !role) {
    return NextResponse.json({ error: 'memberId and role are required' }, { status: 400 });
  }

  const validRoles: TeamRole[] = ['admin', 'editor', 'viewer'];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  // Get the member
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
    const { data: adminMembership } = await supabase
      .from('team_members')
      .select('role')
      .eq('tenant_id', member.tenant_id)
      .eq('user_id', user.id)
      .eq('status', 'accepted')
      .in('role', ['owner', 'admin'])
      .single();

    if (!adminMembership) {
      return NextResponse.json({ error: 'Only owners and admins can change roles' }, { status: 403 });
    }
  }

  const { data, error } = await supabase
    .from('team_members')
    .update({ role })
    .eq('id', memberId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ member: data });
}
