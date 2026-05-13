-- ViolationAlert: NYC Building Violation Monitor
-- Initial schema

-- Enums
create type subscription_tier as enum ('free', 'pro', 'enterprise');
create type notification_channel as enum ('email', 'sms', 'whatsapp');
create type violation_source as enum ('dob', 'hpd', 'ecb');

-- Tenants (one per user, holds billing info)
create table tenants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  org_name text,
  tier subscription_tier default 'free',
  stripe_customer_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Properties (buildings the landlord owns/manages)
create table properties (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  address text not null,
  borough text,
  bin text,
  bbl text,
  zip text,
  city text default 'New York',
  state text default 'NY',
  unit_count integer,
  last_polled_at timestamptz,
  created_at timestamptz default now()
);

-- Violations (pulled from NYC Open Data)
create table violations (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  source violation_source not null,
  source_id text not null,
  violation_type text,
  violation_number text,
  description text,
  severity text,
  issued_date date,
  disposition_date date,
  status text,
  penalty_amount numeric(10,2),
  penalty_paid numeric(10,2),
  respondent text,
  raw_json jsonb,
  first_seen_at timestamptz default now(),
  notified_at timestamptz,
  unique(source, source_id)
);

-- Notification preferences
create table notification_prefs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  channel notification_channel not null,
  destination text not null,
  enabled boolean default true,
  created_at timestamptz default now(),
  unique(tenant_id, channel, destination)
);

-- Notification log
create table notification_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  violation_id uuid references violations(id) on delete set null,
  channel notification_channel not null,
  destination text not null,
  subject text,
  body text,
  status text default 'pending',
  error_message text,
  sent_at timestamptz default now()
);

-- Indexes
create index idx_properties_tenant on properties(tenant_id);
create index idx_properties_bin on properties(bin);
create index idx_properties_bbl on properties(bbl);
create index idx_violations_property on violations(property_id);
create index idx_violations_source on violations(source, source_id);
create index idx_violations_issued on violations(issued_date desc);
create index idx_violations_notified on violations(notified_at) where notified_at is null;
create index idx_notification_log_tenant on notification_log(tenant_id);

-- RLS Policies
alter table tenants enable row level security;
alter table properties enable row level security;
alter table violations enable row level security;
alter table notification_prefs enable row level security;
alter table notification_log enable row level security;

-- Tenant policies
create policy "Users can view own tenant" on tenants
  for select using (user_id = auth.uid());
create policy "Users can update own tenant" on tenants
  for update using (user_id = auth.uid());
create policy "Users can insert own tenant" on tenants
  for insert with check (user_id = auth.uid());

-- Property policies (through tenant)
create policy "Users can view own properties" on properties
  for select using (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can insert own properties" on properties
  for insert with check (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can update own properties" on properties
  for update using (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can delete own properties" on properties
  for delete using (tenant_id in (select id from tenants where user_id = auth.uid()));

-- Violation policies (through property -> tenant)
create policy "Users can view own violations" on violations
  for select using (
    property_id in (
      select p.id from properties p
      join tenants t on t.id = p.tenant_id
      where t.user_id = auth.uid()
    )
  );

-- Notification pref policies
create policy "Users can manage own notification prefs" on notification_prefs
  for all using (tenant_id in (select id from tenants where user_id = auth.uid()));

-- Notification log policies
create policy "Users can view own notification log" on notification_log
  for select using (tenant_id in (select id from tenants where user_id = auth.uid()));

-- Auto-create tenant on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into tenants (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tenants_updated_at
  before update on tenants
  for each row execute function update_updated_at();
