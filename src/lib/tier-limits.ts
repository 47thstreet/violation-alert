import type { SubscriptionTier, ViolationSource, NotificationChannel } from '@/lib/supabase/types';

export interface TierLimits {
  maxProperties: number | null; // null = unlimited
  agencies: ViolationSource[] | 'all';
  scanIntervalMinutes: number;
  channels: NotificationChannel[];
  resolutionEngine: boolean;
  contractorMarketplace: boolean;
  apiAccess: boolean;
  teamMembers: number | null; // null = unlimited
}

const ALL_AGENCIES: ViolationSource[] = [
  'dob', 'hpd', 'ecb', 'fdny', 'dsny', 'dot', 'lpc', 'dep', 'dohmh', 'oath',
];

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: {
    maxProperties: 3,
    agencies: ['dob'],
    scanIntervalMinutes: 1440, // daily
    channels: ['email'],
    resolutionEngine: false,
    contractorMarketplace: false,
    apiAccess: false,
    teamMembers: 1,
  },
  pro: {
    maxProperties: null, // unlimited
    agencies: 'all',
    scanIntervalMinutes: 15,
    channels: ['email', 'sms', 'whatsapp'],
    resolutionEngine: true,
    contractorMarketplace: true,
    apiAccess: false,
    teamMembers: 5,
  },
  enterprise: {
    maxProperties: null,
    agencies: 'all',
    scanIntervalMinutes: 5,
    channels: ['email', 'sms', 'whatsapp'],
    resolutionEngine: true,
    contractorMarketplace: true,
    apiAccess: true,
    teamMembers: null, // unlimited
  },
};

/**
 * Get the limits for a given subscription tier.
 */
export function getTierLimits(tier: SubscriptionTier): TierLimits {
  return TIER_LIMITS[tier];
}

/**
 * Check if a tenant can add another property.
 */
export function canAddProperty(tier: SubscriptionTier, currentCount: number): boolean {
  const limits = TIER_LIMITS[tier];
  if (limits.maxProperties === null) return true;
  return currentCount < limits.maxProperties;
}

/**
 * Check if a tier has access to a specific agency.
 */
export function hasAgencyAccess(tier: SubscriptionTier, agency: ViolationSource): boolean {
  const limits = TIER_LIMITS[tier];
  if (limits.agencies === 'all') return true;
  return limits.agencies.includes(agency);
}

/**
 * Check if a tier has access to a notification channel.
 */
export function hasChannelAccess(tier: SubscriptionTier, channel: NotificationChannel): boolean {
  return TIER_LIMITS[tier].channels.includes(channel);
}

/**
 * Get allowed agencies for display purposes.
 */
export function getAllowedAgencies(tier: SubscriptionTier): ViolationSource[] {
  const limits = TIER_LIMITS[tier];
  if (limits.agencies === 'all') return ALL_AGENCIES;
  return limits.agencies;
}

/** Human-readable tier labels */
export const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: 'Free',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

/** Feature comparison for billing page */
export const PLAN_FEATURES = {
  free: [
    'Up to 3 properties',
    'DOB violations only',
    'Daily scanning',
    'Email notifications',
  ],
  pro: [
    'Unlimited properties',
    'All 10+ agencies',
    '15-minute scanning',
    'Email + SMS + WhatsApp',
    'AI resolution engine',
    'Contractor marketplace',
    'Priority support',
  ],
  enterprise: [
    'Everything in Pro',
    'API access',
    'Unlimited team members',
    'Webhook integrations',
    'Dedicated account manager',
    'Custom reporting',
    'SLA guarantee',
  ],
} as const;
