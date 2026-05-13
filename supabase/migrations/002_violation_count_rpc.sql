-- RPC to get violation counts per property (used in properties list)
create or replace function get_violation_counts(property_ids uuid[])
returns table(property_id uuid, count bigint) as $$
  select v.property_id, count(*)::bigint
  from violations v
  where v.property_id = any(property_ids)
    and v.status = 'open'
  group by v.property_id;
$$ language sql stable security definer;
