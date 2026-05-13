export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export type NotificationChannel = 'email' | 'sms' | 'whatsapp';
export type ViolationSource = 'dob' | 'hpd' | 'ecb' | 'fdny' | 'dsny' | 'dot' | 'lpc' | 'dep' | 'dohmh' | 'oath';

// Helper: makes interfaces compatible with Supabase's GenericTable constraint (TS 5.9+)
// Partial<T> doesn't satisfy Record<string, unknown> in strict mode, so we expand it
type DbRow<T> = { [K in keyof T]: T[K] } & Record<string, unknown>;
type DbInsert<T> = { [K in keyof T]?: T[K] } & Record<string, unknown>;
type DbUpdate<T> = { [K in keyof T]?: T[K] } & Record<string, unknown>;

export interface Tenant {
  id: string;
  user_id: string;
  org_name: string | null;
  tier: SubscriptionTier;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  tenant_id: string;
  address: string;
  borough: string | null;
  bin: string | null;
  bbl: string | null;
  zip: string | null;
  city: string;
  state: string;
  unit_count: number | null;
  last_polled_at: string | null;
  created_at: string;
}

export interface Violation {
  id: string;
  property_id: string;
  source: ViolationSource;
  source_id: string;
  violation_type: string | null;
  violation_number: string | null;
  description: string | null;
  severity: string | null;
  issued_date: string | null;
  disposition_date: string | null;
  status: string | null;
  penalty_amount: number | null;
  penalty_paid: number | null;
  respondent: string | null;
  raw_json: Record<string, unknown> | null;
  first_seen_at: string;
  notified_at: string | null;
}

export interface NotificationPref {
  id: string;
  tenant_id: string;
  channel: NotificationChannel;
  destination: string;
  enabled: boolean;
  created_at: string;
}

export interface NotificationLogEntry {
  id: string;
  tenant_id: string;
  violation_id: string | null;
  channel: NotificationChannel;
  destination: string;
  subject: string | null;
  body: string | null;
  status: string;
  error_message: string | null;
  sent_at: string;
}

// Resolution Engine types (003_resolution_engine.sql)
export type ResolutionStatus = 'open' | 'researching' | 'in_progress' | 'submitted' | 'resolved' | 'dismissed';
export type ResolutionMethod = 'diy' | 'hired_pro' | 'dismissed' | 'auto_resolved';
export type DiyDifficulty = 'easy' | 'moderate' | 'hard' | 'professional_only';
export type ViolationAgency = 'DOB' | 'HPD' | 'ECB' | 'DEP' | 'FDNY' | 'DSNY';

// Marketplace types (004_marketplace.sql)
export type ContractorRequestStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export interface ResolutionStep {
  order: number;
  instruction: string;
  estimated_time: string;
}

export interface PenaltiesInfo {
  fines: Record<string, unknown>;
  escalation_timeline: Record<string, unknown>;
}

export interface ViolationKnowledgeBase {
  id: string;
  violation_type: string;
  violation_code: string;
  agency: ViolationAgency;
  title: string;
  description: string | null;
  resolution_steps: ResolutionStep[] | null;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  timeline_days: number | null;
  required_documents: string[] | null;
  diy_difficulty: DiyDifficulty | null;
  penalties_info: PenaltiesInfo | null;
  ai_generated: boolean;
  verified: boolean;
  search_count: number;
  created_at: string;
  updated_at: string;
}

export interface ResolutionTracking {
  id: string;
  violation_id: string;
  property_id: string;
  tenant_id: string;
  status: ResolutionStatus;
  knowledge_base_id: string | null;
  started_at: string | null;
  submitted_at: string | null;
  resolved_at: string | null;
  resolution_notes: string | null;
  resolution_method: ResolutionMethod | null;
  contractor_id: string | null;
  evidence_urls: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Contractor {
  id: string;
  name: string;
  company_name: string | null;
  license_number: string | null;
  license_type: string | null;
  violation_types_served: string[] | null;
  agencies_served: string[] | null;
  boroughs_served: string[] | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  description: string | null;
  years_experience: number | null;
  avg_rating: number;
  review_count: number;
  verified: boolean;
  active: boolean;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContractorReview {
  id: string;
  contractor_id: string;
  tenant_id: string;
  rating: number;
  review_text: string | null;
  violation_type: string | null;
  created_at: string;
}

export interface ContractorRequest {
  id: string;
  tenant_id: string;
  contractor_id: string;
  resolution_tracking_id: string | null;
  violation_type: string | null;
  property_address: string | null;
  status: ContractorRequestStatus;
  message: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      tenants: { Row: DbRow<Tenant>; Insert: DbInsert<Tenant> & { user_id: string }; Update: DbUpdate<Tenant>; Relationships: never[] };
      properties: { Row: DbRow<Property>; Insert: DbInsert<Property> & { tenant_id: string; address: string }; Update: DbUpdate<Property>; Relationships: never[] };
      violations: { Row: DbRow<Violation>; Insert: DbInsert<Violation> & { property_id: string; source: ViolationSource; source_id: string }; Update: DbUpdate<Violation>; Relationships: never[] };
      notification_prefs: { Row: DbRow<NotificationPref>; Insert: DbInsert<NotificationPref> & { tenant_id: string; channel: NotificationChannel; destination: string }; Update: DbUpdate<NotificationPref>; Relationships: never[] };
      notification_log: { Row: DbRow<NotificationLogEntry>; Insert: DbInsert<NotificationLogEntry> & { tenant_id: string; channel: NotificationChannel; destination: string }; Update: DbUpdate<NotificationLogEntry>; Relationships: never[] };
      violation_knowledge_base: { Row: DbRow<ViolationKnowledgeBase>; Insert: DbInsert<ViolationKnowledgeBase> & { violation_type: string; violation_code: string; agency: ViolationAgency; title: string }; Update: DbUpdate<ViolationKnowledgeBase>; Relationships: never[] };
      resolution_tracking: { Row: DbRow<ResolutionTracking>; Insert: DbInsert<ResolutionTracking> & { violation_id: string; property_id: string; tenant_id: string }; Update: DbUpdate<ResolutionTracking>; Relationships: never[] };
      contractors: { Row: DbRow<Contractor>; Insert: DbInsert<Contractor> & { name: string }; Update: DbUpdate<Contractor>; Relationships: never[] };
      contractor_reviews: { Row: DbRow<ContractorReview>; Insert: DbInsert<ContractorReview> & { contractor_id: string; tenant_id: string; rating: number }; Update: DbUpdate<ContractorReview>; Relationships: never[] };
      contractor_requests: { Row: DbRow<ContractorRequest>; Insert: DbInsert<ContractorRequest> & { tenant_id: string; contractor_id: string }; Update: DbUpdate<ContractorRequest>; Relationships: never[] };
    };
    Views: Record<string, never>;
    Functions: {
      get_violation_counts: {
        Args: { property_ids: string[] };
        Returns: { property_id: string; count: number }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
