-- ViolationAlert: Resolution Engine
-- Knowledge base + resolution tracking

-- Violation Knowledge Base: how to fix each violation type
create table violation_knowledge_base (
  id uuid primary key default gen_random_uuid(),
  violation_type text not null,
  violation_code text not null,
  agency text not null check (agency in ('DOB', 'HPD', 'ECB', 'DEP', 'FDNY', 'DSNY')),
  title text not null,
  description text,
  resolution_steps jsonb, -- [{order, instruction, estimated_time}]
  estimated_cost_min numeric,
  estimated_cost_max numeric,
  timeline_days integer,
  required_documents text[],
  diy_difficulty text check (diy_difficulty in ('easy', 'moderate', 'hard', 'professional_only')),
  penalties_info jsonb, -- {fines, escalation_timeline}
  ai_generated boolean default false,
  verified boolean default false,
  search_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(violation_type, violation_code, agency)
);

-- Resolution Tracking: per-violation resolution progress
create table resolution_tracking (
  id uuid primary key default gen_random_uuid(),
  violation_id text not null,
  property_id uuid references properties(id) on delete cascade not null,
  tenant_id uuid references tenants(id) on delete cascade not null,
  status text not null default 'open' check (status in ('open', 'researching', 'in_progress', 'submitted', 'resolved', 'dismissed')),
  knowledge_base_id uuid references violation_knowledge_base(id) on delete set null,
  started_at timestamptz,
  submitted_at timestamptz,
  resolved_at timestamptz,
  resolution_notes text,
  resolution_method text check (resolution_method in ('diy', 'hired_pro', 'dismissed', 'auto_resolved')),
  contractor_id uuid, -- FK added in 004_marketplace.sql
  evidence_urls text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_kb_agency on violation_knowledge_base(agency);
create index idx_kb_violation_type on violation_knowledge_base(violation_type);
create index idx_kb_search_count on violation_knowledge_base(search_count desc);
create index idx_resolution_tenant on resolution_tracking(tenant_id);
create index idx_resolution_property on resolution_tracking(property_id);
create index idx_resolution_status on resolution_tracking(status);
create index idx_resolution_violation on resolution_tracking(violation_id);

-- Updated_at triggers
create trigger violation_knowledge_base_updated_at
  before update on violation_knowledge_base
  for each row execute function update_updated_at();

create trigger resolution_tracking_updated_at
  before update on resolution_tracking
  for each row execute function update_updated_at();

-- RLS
alter table violation_knowledge_base enable row level security;
alter table resolution_tracking enable row level security;

-- Knowledge base: readable by all authenticated users
create policy "Authenticated users can read knowledge base" on violation_knowledge_base
  for select using (auth.role() = 'authenticated');

-- Resolution tracking: filtered through tenant_id
create policy "Users can view own resolutions" on resolution_tracking
  for select using (tenant_id in (select id from tenants where user_id = auth.uid()));

create policy "Users can insert own resolutions" on resolution_tracking
  for insert with check (tenant_id in (select id from tenants where user_id = auth.uid()));

create policy "Users can update own resolutions" on resolution_tracking
  for update using (tenant_id in (select id from tenants where user_id = auth.uid()));

create policy "Users can delete own resolutions" on resolution_tracking
  for delete using (tenant_id in (select id from tenants where user_id = auth.uid()));
