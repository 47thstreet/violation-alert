-- Team/Collaborator system for multi-user access to tenants

-- Enums
create type team_role as enum ('owner', 'admin', 'editor', 'viewer');
create type invite_status as enum ('pending', 'accepted', 'rejected');

-- Team members table
create table team_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade,  -- null until accepted
  invited_email text not null,
  role team_role not null default 'viewer',
  status invite_status not null default 'pending',
  invited_by uuid references auth.users(id),
  invited_at timestamptz default now(),
  accepted_at timestamptz
);

-- One invite per email per tenant
create unique index team_members_tenant_email on team_members(tenant_id, invited_email);
create index idx_team_members_user on team_members(user_id) where user_id is not null;
create index idx_team_members_email on team_members(invited_email);

-- RLS
alter table team_members enable row level security;

-- Helper: check if current user is owner or admin of a tenant
create or replace function is_tenant_admin(t_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from tenants where id = t_id and user_id = auth.uid()
  ) or exists (
    select 1 from team_members
    where tenant_id = t_id
      and user_id = auth.uid()
      and status = 'accepted'
      and role in ('owner', 'admin')
  );
end;
$$ language plpgsql security definer stable;

-- Helper: check if current user is any accepted member (or owner) of a tenant
create or replace function is_tenant_member(t_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from tenants where id = t_id and user_id = auth.uid()
  ) or exists (
    select 1 from team_members
    where tenant_id = t_id
      and user_id = auth.uid()
      and status = 'accepted'
  );
end;
$$ language plpgsql security definer stable;

-- Policies for team_members table
create policy "Owners and admins can manage team members" on team_members
  for all using (is_tenant_admin(tenant_id));

create policy "Accepted members can view team list" on team_members
  for select using (is_tenant_member(tenant_id));

create policy "Invited users can view their own invites" on team_members
  for select using (
    invited_email = (select email from auth.users where id = auth.uid())
  );

create policy "Invited users can update their own invites" on team_members
  for update using (
    invited_email = (select email from auth.users where id = auth.uid())
  );

-- Extend property access to team members
create policy "Team members can view properties" on properties
  for select using (
    tenant_id in (
      select tenant_id from team_members
      where user_id = auth.uid() and status = 'accepted'
    )
  );

-- Team editors/admins can update properties
create policy "Team editors can update properties" on properties
  for update using (
    tenant_id in (
      select tenant_id from team_members
      where user_id = auth.uid()
        and status = 'accepted'
        and role in ('owner', 'admin', 'editor')
    )
  );

-- Extend violation access to team members
create policy "Team members can view violations" on violations
  for select using (
    property_id in (
      select p.id from properties p
      join team_members tm on tm.tenant_id = p.tenant_id
      where tm.user_id = auth.uid() and tm.status = 'accepted'
    )
  );

-- Extend notification_prefs access to team members (view only)
create policy "Team members can view notification prefs" on notification_prefs
  for select using (
    tenant_id in (
      select tenant_id from team_members
      where user_id = auth.uid() and status = 'accepted'
    )
  );

-- Extend notification_log access to team members (view only)
create policy "Team members can view notification log" on notification_log
  for select using (
    tenant_id in (
      select tenant_id from team_members
      where user_id = auth.uid() and status = 'accepted'
    )
  );
