import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';
import type { SubscriptionTier } from '@/lib/supabase/types';
import Stripe from 'stripe';

/**
 * Stripe webhook handler.
 * No auth — verified via Stripe webhook signing secret.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const tenantId = session.metadata?.tenant_id;
        const customerId = session.customer as string;

        if (!tenantId) {
          console.error('checkout.session.completed: no tenant_id in metadata');
          break;
        }

        // Determine tier from the subscription's price
        let tier: SubscriptionTier = 'pro';
        if (session.subscription) {
          const subscription = await getStripe().subscriptions.retrieve(session.subscription as string);
          const priceId = subscription.items.data[0]?.price.id;
          if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
            tier = 'enterprise';
          }
        }

        await supabase
          .from('tenants')
          .update({
            tier,
            stripe_customer_id: customerId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', tenantId);

        console.log(`Tenant ${tenantId} upgraded to ${tier}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const tenantId = subscription.metadata?.tenant_id;

        if (!tenantId) {
          console.error('customer.subscription.updated: no tenant_id in metadata');
          break;
        }

        const priceId = subscription.items.data[0]?.price.id;
        let tier: SubscriptionTier = 'pro';
        if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
          tier = 'enterprise';
        }

        // If subscription is cancelled/past_due, downgrade
        if (['canceled', 'past_due', 'unpaid'].includes(subscription.status)) {
          tier = 'free';
        }

        await supabase
          .from('tenants')
          .update({
            tier,
            updated_at: new Date().toISOString(),
          })
          .eq('id', tenantId);

        console.log(`Tenant ${tenantId} subscription updated to ${tier}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const tenantId = subscription.metadata?.tenant_id;

        if (!tenantId) {
          // Fallback: look up tenant by stripe_customer_id
          const customerId = subscription.customer as string;
          const { data: tenant } = await supabase
            .from('tenants')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single();

          if (tenant) {
            await supabase
              .from('tenants')
              .update({
                tier: 'free' as SubscriptionTier,
                updated_at: new Date().toISOString(),
              })
              .eq('id', tenant.id);
            console.log(`Tenant ${tenant.id} downgraded to free (by customer_id)`);
          }
          break;
        }

        await supabase
          .from('tenants')
          .update({
            tier: 'free' as SubscriptionTier,
            updated_at: new Date().toISOString(),
          })
          .eq('id', tenantId);

        console.log(`Tenant ${tenantId} downgraded to free`);
        break;
      }

      default:
        // Unhandled event type — acknowledge receipt
        break;
    }
  } catch (error) {
    console.error(`Error processing webhook event ${event.type}:`, error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
