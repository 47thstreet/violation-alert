import { Resend } from 'resend';
import type { Violation, Property } from '../supabase/types';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

export async function sendViolationEmail(
  to: string,
  property: Property,
  violations: Violation[]
) {
  const violationRows = violations.map(v => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${v.source.toUpperCase()}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;">${v.violation_number || 'N/A'}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;">${v.severity || 'Unknown'}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;">${v.description?.slice(0, 80) || 'N/A'}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;">${v.issued_date || 'N/A'}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;">$${v.penalty_amount?.toFixed(2) || '0.00'}</td>
    </tr>
  `).join('');

  const count = violations.length;
  const subject = `${count} New Violation${count > 1 ? 's' : ''} — ${property.address}`;

  const { error } = await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'alerts@violationalert.com',
    to,
    subject,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;">
        <div style="background:#dc2626;color:white;padding:16px 24px;border-radius:8px 8px 0 0;">
          <h2 style="margin:0;">ViolationAlert</h2>
        </div>
        <div style="padding:24px;background:#fff;border:1px solid #e5e7eb;">
          <p style="font-size:16px;margin-top:0;">
            <strong>${count} new violation${count > 1 ? 's' : ''}</strong> found for:
          </p>
          <p style="font-size:18px;font-weight:600;color:#1f2937;">${property.address}</p>
          <table style="width:100%;border-collapse:collapse;font-size:13px;margin:16px 0;">
            <thead>
              <tr style="background:#f9fafb;text-align:left;">
                <th style="padding:8px;">Source</th>
                <th style="padding:8px;">Violation #</th>
                <th style="padding:8px;">Severity</th>
                <th style="padding:8px;">Description</th>
                <th style="padding:8px;">Issued</th>
                <th style="padding:8px;">Penalty</th>
              </tr>
            </thead>
            <tbody>${violationRows}</tbody>
          </table>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/properties/${property.id}"
             style="display:inline-block;background:#dc2626;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">
            View Details
          </a>
        </div>
        <div style="padding:12px 24px;text-align:center;color:#9ca3af;font-size:12px;">
          ViolationAlert — NYC Building Violation Monitor
        </div>
      </div>
    `,
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
  return { success: true };
}
