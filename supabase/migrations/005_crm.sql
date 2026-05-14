-- ViolationAlert: CRM module for building/property management
-- Enums
create type building_type as enum ('residential', 'commercial', 'mixed');
create type contact_role as enum ('owner', 'manager', 'tenant', 'superintendent', 'attorney', 'contractor');
create type document_type as enum ('insurance', 'permit', 'cof_o', 'lease', 'inspection', 'correspondence', 'other');
create type note_type as enum ('general', 'maintenance', 'violation', 'inspection', 'legal');
create type maintenance_priority as enum ('low', 'medium', 'high', 'urgent');
create type maintenance_status as enum ('open', 'assigned', 'in_progress', 'completed', 'cancelled');
create type maintenance_category as enum ('plumbing', 'electrical', 'hvac', 'structural', 'pest', 'other');

-- Building details (1:1 with properties)
create table building_details (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null unique,
  tenant_id uuid references tenants(id) on delete cascade not null,
  year_built integer,
  building_class text,
  building_type building_type,
  total_units integer,
  total_sqft integer,
  floors integer,
  lot_sqft integer,
  zoning text,
  owner_name text,
  owner_phone text,
  owner_email text,
  management_company text,
  insurance_provider text,
  insurance_policy_number text,
  insurance_expiry date,
  certificate_of_occupancy text,
  last_inspection_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Property contacts
create table property_contacts (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  tenant_id uuid references tenants(id) on delete cascade not null,
  name text not null,
  role contact_role not null,
  phone text,
  email text,
  unit_number text,
  notes text,
  created_at timestamptz default now()
);

-- Property documents
create table property_documents (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  tenant_id uuid references tenants(id) on delete cascade not null,
  name text not null,
  document_type document_type not null default 'other',
  file_url text,
  file_size integer,
  uploaded_at timestamptz default now(),
  expiry_date date,
  notes text
);

-- Property notes
create table property_notes (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  tenant_id uuid references tenants(id) on delete cascade not null,
  author_name text,
  content text not null,
  note_type note_type default 'general',
  pinned boolean default false,
  created_at timestamptz default now()
);

-- Maintenance requests
create table maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade not null,
  tenant_id uuid references tenants(id) on delete cascade not null,
  title text not null,
  description text,
  priority maintenance_priority default 'medium',
  status maintenance_status default 'open',
  unit_number text,
  category maintenance_category default 'other',
  assigned_to text,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_building_details_property on building_details(property_id);
create index idx_building_details_tenant on building_details(tenant_id);
create index idx_property_contacts_property on property_contacts(property_id);
create index idx_property_contacts_tenant on property_contacts(tenant_id);
create index idx_property_documents_property on property_documents(property_id);
create index idx_property_documents_tenant on property_documents(tenant_id);
create index idx_property_notes_property on property_notes(property_id);
create index idx_property_notes_tenant on property_notes(tenant_id);
create index idx_maintenance_requests_property on maintenance_requests(property_id);
create index idx_maintenance_requests_tenant on maintenance_requests(tenant_id);
create index idx_maintenance_requests_status on maintenance_requests(status);

-- RLS
alter table building_details enable row level security;
alter table property_contacts enable row level security;
alter table property_documents enable row level security;
alter table property_notes enable row level security;
alter table maintenance_requests enable row level security;

-- Building details policies
create policy "Users can view own building details" on building_details
  for select using (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can insert own building details" on building_details
  for insert with check (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can update own building details" on building_details
  for update using (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can delete own building details" on building_details
  for delete using (tenant_id in (select id from tenants where user_id = auth.uid()));

-- Property contacts policies
create policy "Users can view own contacts" on property_contacts
  for select using (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can insert own contacts" on property_contacts
  for insert with check (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can update own contacts" on property_contacts
  for update using (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can delete own contacts" on property_contacts
  for delete using (tenant_id in (select id from tenants where user_id = auth.uid()));

-- Property documents policies
create policy "Users can view own documents" on property_documents
  for select using (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can insert own documents" on property_documents
  for insert with check (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can update own documents" on property_documents
  for update using (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can delete own documents" on property_documents
  for delete using (tenant_id in (select id from tenants where user_id = auth.uid()));

-- Property notes policies
create policy "Users can view own notes" on property_notes
  for select using (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can insert own notes" on property_notes
  for insert with check (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can update own notes" on property_notes
  for update using (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can delete own notes" on property_notes
  for delete using (tenant_id in (select id from tenants where user_id = auth.uid()));

-- Maintenance requests policies
create policy "Users can view own maintenance requests" on maintenance_requests
  for select using (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can insert own maintenance requests" on maintenance_requests
  for insert with check (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can update own maintenance requests" on maintenance_requests
  for update using (tenant_id in (select id from tenants where user_id = auth.uid()));
create policy "Users can delete own maintenance requests" on maintenance_requests
  for delete using (tenant_id in (select id from tenants where user_id = auth.uid()));

-- Updated_at triggers
create trigger building_details_updated_at
  before update on building_details
  for each row execute function update_updated_at();

create trigger maintenance_requests_updated_at
  before update on maintenance_requests
  for each row execute function update_updated_at();
