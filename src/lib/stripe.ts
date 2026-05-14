import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  return _stripe;
}

export const stripe = undefined as unknown as Stripe; // legacy compat — use getStripe()

/**
 * Create a Stripe Checkout session for upgrading to Pro or Enterprise.
 */
export async function createCheckoutSession(opts: {
  customerId?: string;
  customerEmail: string;
  priceId: string;
  tenantId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: opts.customerId || undefined,
    customer_email: opts.customerId ? undefined : opts.customerEmail,
    line_items: [{ price: opts.priceId, quantity: 1 }],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    metadata: {
      tenant_id: opts.tenantId,
    },
    subscription_data: {
      metadata: {
        tenant_id: opts.tenantId,
      },
    },
  });

  return session;
}

/**
 * Create a Stripe Customer Portal session for managing an existing subscription.
 */
export async function createPortalSession(opts: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await getStripe().billingPortal.sessions.create({
    customer: opts.customerId,
    return_url: opts.returnUrl,
  });

  return session;
}

/** Price IDs from environment */
export function getPriceId(tier: 'pro' | 'enterprise'): string {
  if (tier === 'pro') {
    const id = process.env.STRIPE_PRO_PRICE_ID;
    if (!id) throw new Error('Missing STRIPE_PRO_PRICE_ID');
    return id;
  }
  const id = process.env.STRIPE_ENTERPRISE_PRICE_ID;
  if (!id) throw new Error('Missing STRIPE_ENTERPRISE_PRICE_ID');
  return id;
}
