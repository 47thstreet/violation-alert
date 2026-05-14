import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createCheckoutSession, getPriceId } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tier } = (await req.json()) as { tier: 'pro' | 'enterprise' };

    if (!tier || !['pro', 'enterprise'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    // Get tenant
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id, stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const priceId = getPriceId(tier);
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const session = await createCheckoutSession({
      customerId: tenant.stripe_customer_id || undefined,
      customerEmail: user.email!,
      priceId,
      tenantId: tenant.id,
      successUrl: `${origin}/settings/billing?success=true`,
      cancelUrl: `${origin}/settings/billing?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
