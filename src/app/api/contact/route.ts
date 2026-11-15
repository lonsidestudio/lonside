import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { SeverityNumber } from '@opentelemetry/api-logs';
import { Resend } from 'resend';
import { z } from 'zod';
import { flushPostHogLogs, getPostHogLogger } from '@/instrumentation';

// In-memory rate limiter — 3 requests per IP per minute
// For multi-instance production, replace with Upstash Redis
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

const contactSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255).trim(),
  subject: z.string().max(200).trim().optional().default(''),
  message: z.string().min(10).max(5000).trim(),
  // Honeypot — bots fill this, humans don't
  _trap: z.string().max(0, 'Bot detected').optional().default(''),
});

export async function POST(request: NextRequest) {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@lonside.com';

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Trop de requêtes. Réessayez dans une minute.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides.', details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { name, email, subject, message, _trap } = parsed.data;

  // Honeypot check
  if (_trap) {
    return NextResponse.json({ success: true }); // Silent success to mislead bots
  }

  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Service de contact indisponible.' }, { status: 503 });
    }
    console.warn('[contact] RESEND_API_KEY not set — email skipped in dev.');
    return NextResponse.json({ success: true, delivered: false });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: 'lonside <onboarding@resend.dev>',
    to: [contactEmail],
    replyTo: email,
    subject: `[lonside.com] ${subject || `Message de ${name}`}`,
    html: `
      <div style="font-family:monospace;background:#050505;color:#fafafa;padding:32px;max-width:600px;border-radius:12px">
        <div style="display:flex;align-items:center;margin-bottom:24px">
          <div style="background:#7c3aed;width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-right:12px;font-size:18px;font-weight:bold;color:white">L</div>
          <span style="font-size:20px;font-weight:bold;color:white">lonside<span style="color:#7c3aed">.</span></span>
        </div>
        <h2 style="color:#7c3aed;font-size:14px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 24px">Nouveau message</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#94a3b8;font-size:12px;width:80px">Nom</td><td style="padding:8px 0;color:#fafafa;font-size:12px">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8;font-size:12px">Email</td><td style="padding:8px 0;font-size:12px"><a href="mailto:${email}" style="color:#7c3aed">${email}</a></td></tr>
          ${subject ? `<tr><td style="padding:8px 0;color:#94a3b8;font-size:12px">Sujet</td><td style="padding:8px 0;color:#fafafa;font-size:12px">${subject}</td></tr>` : ''}
        </table>
        <hr style="border:none;border-top:1px solid #1f1f27;margin:20px 0"/>
        <p style="color:#94a3b8;font-size:12px;white-space:pre-wrap;line-height:1.6">${message}</p>
        <p style="color:#374151;font-size:10px;margin-top:32px">IP: ${ip} · ${new Date().toISOString()}</p>
      </div>
    `,
  });

  if (error) {
    console.error('[contact] Resend error:', error);
    getPostHogLogger()?.emit({
      body: 'Contact email delivery failed',
      severityNumber: SeverityNumber.ERROR,
      attributes: { route: '/api/contact', delivery_provider: 'resend' },
    });
    after(flushPostHogLogs);
    return NextResponse.json({ error: 'Erreur lors de l\'envoi.' }, { status: 500 });
  }

  getPostHogLogger()?.emit({
    body: 'Contact email delivered',
    severityNumber: SeverityNumber.INFO,
    attributes: { route: '/api/contact', delivery_provider: 'resend' },
  });
  after(flushPostHogLogs);
  return NextResponse.json({ success: true, delivered: true });
}

