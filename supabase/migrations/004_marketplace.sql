-- ViolationAlert: Marketplace
-- Contractor directory, reviews, and hire requests

-- Contractors: professional directory
create table contractors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_name text,
  license_number text,
  license_type text,
  violation_types_served text[],
  agencies_served text[],
  boroughs_served text[],
  phone text,
  email text,
  website text,
  description text,
  years_experience integer,
  avg_rating numeric default 0,
  review_count integer default 0,
  verified boolean default false,
  active boolean default true,
  profile_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Contractor Reviews
create table contractor_reviews (
  id uuid primary key default gen_random_uuid(),
  contractor_id uuid references contractors(id) on delete cascade not null,
  tenant_id uuid references tenants(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  review_text text,
  violation_type text,
  created_at timestamptz default now()
);

-- Contractor Requests: when a user wants to hire a pro
create table contractor_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  contractor_id uuid references contractors(id) on delete cascade not null,
  resolution_tracking_id uuid references resolution_tracking(id) on delete set null,
  violation_type text,
  property_address text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add FK from resolution_tracking.contractor_id -> contractors
alter table resolution_tracking
  add constraint fk_resolution_contractor
  foreign key (contractor_id) references contractors(id) on delete set null;

-- Indexes
create index idx_contractors_active on contractors(active) where active = true;
create index idx_contractors_verified on contractors(verified) where verified = true;
create index idx_contractors_rating on contractors(avg_rating desc);
create index idx_contractors_boroughs on contractors using gin(boroughs_served);
create index idx_contractors_agencies on contractors using gin(agencies_served);
create index idx_contractors_violation_types on contractors using gin(violation_types_served);
create index idx_reviews_contractor on contractor_reviews(contractor_id);
create index idx_reviews_tenant on contractor_reviews(tenant_id);
create index idx_requests_tenant on contractor_requests(tenant_id);
create index idx_requests_contractor on contractor_requests(contractor_id);
create index idx_requests_status on contractor_requests(status);

-- Updated_at triggers
create trigger contractors_updated_at
  before update on contractors
  for each row execute function update_updated_at();

create trigger contractor_requests_updated_at
  before update on contractor_requests
  for each row execute function update_updated_at();

-- RLS
alter table contractors enable row level security;
alter table contractor_reviews enable row level security;
alter table contractor_requests enable row level security;

-- Contractors: readable by all authenticated users
create policy "Authenticated users can read contractors" on contractors
  for select using (auth.role() = 'authenticated');

-- Reviews: readable by all authenticated, writable by owner
create policy "Authenticated users can read reviews" on contractor_reviews
  for select using (auth.role() = 'authenticated');

create policy "Users can insert own reviews" on contractor_reviews
  for insert with check (tenant_id in (select id from tenants where user_id = auth.uid()));

create policy "Users can update own reviews" on contractor_reviews
  for update using (tenant_id in (select id from tenants where user_id = auth.uid()));

create policy "Users can delete own reviews" on contractor_reviews
  for delete using (tenant_id in (select id from tenants where user_id = auth.uid()));

-- Requests: filtered by tenant_id
create policy "Users can view own requests" on contractor_requests
  for select using (tenant_id in (select id from tenants where user_id = auth.uid()));

create policy "Users can insert own requests" on contractor_requests
  for insert with check (tenant_id in (select id from tenants where user_id = auth.uid()));

create policy "Users can update own requests" on contractor_requests
  for update using (tenant_id in (select id from tenants where user_id = auth.uid()));

create policy "Users can delete own requests" on contractor_requests
  for delete using (tenant_id in (select id from tenants where user_id = auth.uid()));
