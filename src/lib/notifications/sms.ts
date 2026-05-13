import twilio from 'twilio';
import type { Violation, Property } from '../supabase/types';

function getClient() {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );
}

export async function sendViolationSMS(
  to: string,
  property: Property,
  violations: Violation[]
) {
  const client = getClient();
  const count = violations.length;
  const worst = violations.find(v =>
    v.severity === 'immediately-hazardous' || v.severity === 'C'
  );

  let body = `ViolationAlert: ${count} new violation${count > 1 ? 's' : ''} at ${property.address}.`;
  if (worst) {
    body += ` CRITICAL: ${worst.description?.slice(0, 60)}`;
  }
  const totalPenalty = violations.reduce((sum, v) => sum + (v.penalty_amount || 0), 0);
  if (totalPenalty > 0) {
    body += ` Total penalties: $${totalPenalty.toFixed(2)}`;
  }
  body += ` Details: ${process.env.NEXT_PUBLIC_APP_URL}/properties/${property.id}`;

  const message = await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
  });

  return { success: true, sid: message.sid };
}

export async function sendViolationWhatsApp(
  to: string,
  property: Property,
  violations: Violation[]
) {
  const client = getClient();
  const count = violations.length;

  const lines = violations.slice(0, 5).map(v =>
    `- *${v.source.toUpperCase()}* ${v.violation_number || ''}: ${v.description?.slice(0, 60) || 'N/A'} (${v.severity || 'unknown'})`
  );

  let body = `*ViolationAlert*\n\n`;
  body += `${count} new violation${count > 1 ? 's' : ''} at:\n*${property.address}*\n\n`;
  body += lines.join('\n');
  if (violations.length > 5) body += `\n...and ${violations.length - 5} more`;
  body += `\n\nView: ${process.env.NEXT_PUBLIC_APP_URL}/properties/${property.id}`;

  const message = await client.messages.create({
    body,
    from: process.env.TWILIO_WHATSAPP_NUMBER!,
    to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
  });

  return { success: true, sid: message.sid };
}
