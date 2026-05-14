'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { TeamMember, TeamRole } from '@/lib/supabase/types';
import Link from 'next/link';
import { EmptyState, UsersIcon } from '@/components/empty-state';
import { useToast } from '@/components/toast';
import { Breadcrumbs } from '@/components/breadcrumbs';

const ROLE_LABELS: Record<TeamRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
};

const ROLE_COLORS: Record<TeamRole, string> = {
  owner: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-blue-700',
  editor: 'bg-green-100 text-green-700',
  viewer: 'bg-gray-100 text-gray-600',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<TeamMember[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamRole>('viewer');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { toast } = useToast();
  const [tenantId, setTenantId] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  const loadTeam = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setCurrentUserEmail(user.email || '');

    // Check if user is tenant owner
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (tenant) {
      setTenantId(tenant.id);
      setIsOwner(true);

      // Load team members for this tenant
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .eq('tenant_id', tenant.id)
        .order('invited_at', { ascending: true });

      setMembers(data || []);
    }

    // Load pending invites for the current user (where they are invited)
    const { data: invites } = await supabase
      .from('team_members')
      .select('*')
      .eq('invited_email', user.email?.toLowerCase() ?? '')
      .eq('status', 'pending');

    setPendingInvites(invites || []);
    setPageLoading(false);
  }, []);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    const res = await fetch('/api/team/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), role }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || 'Failed to invite');
    } else {
      toast.success(`Invite sent to ${email}`);
      setEmail('');
      await loadTeam();
    }
    setLoading(false);
  }

  async function handleRemove(memberId: string) {
    if (!confirm('Remove this team member?')) return;

    const res = await fetch('/api/team/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId }),
    });

    if (res.ok) {
      toast.success('Member removed');
      await loadTeam();
    } else {
      const data = await res.json();
      toast.error(data.error || 'Failed to remove');
    }
  }

  async function handleRoleChange(memberId: string, newRole: TeamRole) {
    const res = await fetch('/api/team/role', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, role: newRole }),
    });

    if (res.ok) {
      toast.success('Role updated');
      await loadTeam();
    } else {
      const data = await res.json();
      toast.error(data.error || 'Failed to update role');
    }
  }

  async function handleInviteAction(inviteId: string, action: 'accept' | 'reject') {
    const res = await fetch('/api/team/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteId, action }),
    });

    if (res.ok) {
      toast.success(action === 'accept' ? 'Invite accepted' : 'Invite rejected');
      await loadTeam();
    } else {
      const data = await res.json();
      toast.error(data.error || 'Failed to process invite');
    }
  }

  if (pageLoading) {
    return (
      <div className="max-w-2xl space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-80 mb-8" />
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-40" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <Breadcrumbs items={[
          { label: 'Home', href: '/properties' },
          { label: 'Settings', href: '/settings' },
          { label: 'Team' },
        ]} />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Members</h1>
        <p className="text-gray-500 text-sm">
          Invite collaborators to view or manage your properties and violations.
        </p>
      </div>

      {/* Pending invites for current user */}
      {pendingInvites.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-3">Pending Invitations</h2>
          <div className="space-y-3">
            {pendingInvites.map(invite => (
              <div key={invite.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-yellow-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    You have been invited as <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${ROLE_COLORS[invite.role]}`}>{ROLE_LABELS[invite.role]}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleInviteAction(invite.id, 'accept')}
                    className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleInviteAction(invite.id, 'reject')}
                    className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite form (owner/admin only) */}
      {isOwner && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Invite Team Member</h2>
          <form onSubmit={handleInvite} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
            <select
              value={role}
              onChange={e => setRole(e.target.value as TeamRole)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Inviting...' : 'Invite'}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2">
            Viewers can see properties and violations. Editors can also make changes. Admins can manage the team.
          </p>
        </div>
      )}

      {/* Team list */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">
          Current Team
          {members.length > 0 && (
            <span className="text-sm font-normal text-gray-400 ml-2">
              ({members.length} member{members.length !== 1 ? 's' : ''})
            </span>
          )}
        </h2>

        {/* Owner row (always shown) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                {currentUserEmail.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{currentUserEmail}</p>
                <p className="text-xs text-gray-400">You</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded ${ROLE_COLORS.owner}`}>
              Owner
            </span>
          </div>

          {/* Team members */}
          {members.map(member => (
            <div key={member.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold">
                  {member.invited_email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{member.invited_email}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${STATUS_COLORS[member.status]}`}>
                      {member.status}
                    </span>
                    {member.accepted_at && (
                      <span className="text-xs text-gray-400">
                        Joined {new Date(member.accepted_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isOwner ? (
                  <>
                    <select
                      value={member.role}
                      onChange={e => handleRoleChange(member.id, e.target.value as TeamRole)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <span className={`text-xs font-bold px-2 py-1 rounded ${ROLE_COLORS[member.role]}`}>
                    {ROLE_LABELS[member.role]}
                  </span>
                )}
              </div>
            </div>
          ))}

          {members.length === 0 && (
            <EmptyState
              icon={<UsersIcon />}
              title="You're the only member"
              description="Invite your team to collaborate on property management"
              action={{ label: 'Invite', href: '/settings/team' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
