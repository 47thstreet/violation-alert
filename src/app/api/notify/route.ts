import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendViolationEmail } from '@/lib/notifications/email';
import { sendViolationSMS, sendViolationWhatsApp } from '@/lib/notifications/sms';
import type { Property, Violation } from '@/lib/supabase/types';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { propertyId, violationIds } = await req.json() as {
    propertyId: string;
    violationIds: string[];
  };

  const supabase = createServiceClient();

  // Get property
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  // Get violations
  const { data: violations } = await supabase
    .from('violations')
    .select('*')
    .in('id', violationIds);

  if (!violations || violations.length === 0) {
    return NextResponse.json({ error: 'No violations found' }, { status: 404 });
  }

  // Get tenant's notification preferences
  const { data: prefs } = await supabase
    .from('notification_prefs')
    .select('*')
    .eq('tenant_id', property.tenant_id)
    .eq('enabled', true);

  if (!prefs || prefs.length === 0) {
    return NextResponse.json({ message: 'No notification prefs configured' });
  }

  const results: { channel: string; status: string; error?: string }[] = [];

  for (const pref of prefs) {
    try {
      switch (pref.channel) {
        case 'email':
          await sendViolationEmail(pref.destination, property as Property, violations as Violation[]);
          break;
        case 'sms':
          await sendViolationSMS(pref.destination, property as Property, violations as Violation[]);
          break;
        case 'whatsapp':
          await sendViolationWhatsApp(pref.destination, property as Property, violations as Violation[]);
          break;
      }

      // Log success
      await supabase.from('notification_log').insert({
        tenant_id: property.tenant_id,
        violation_id: violationIds[0],
        channel: pref.channel,
        destination: pref.destination,
        status: 'sent',
      });

      results.push({ channel: pref.channel, status: 'sent' });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      await supabase.from('notification_log').insert({
        tenant_id: property.tenant_id,
        violation_id: violationIds[0],
        channel: pref.channel,
        destination: pref.destination,
        status: 'failed',
        error_message: errorMsg,
      });
      results.push({ channel: pref.channel, status: 'failed', error: errorMsg });
    }
  }

  // Mark violations as notified
  await supabase
    .from('violations')
    .update({ notified_at: new Date().toISOString() })
    .in('id', violationIds);

  return NextResponse.json({ results });
}
