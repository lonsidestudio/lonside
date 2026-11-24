import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// In-memory rate limiter — 3 requests per IP per minute, bounded to prevent memory exhaustion.
// For multi-instance production, replace with Upstash Redis.
const MAX_RATE_LIMIT_ENTRIES = 1000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeHeaderValue(input: string): string {
  return input.replace(/[\r\n]+/g, ' ').trim();
}

function isAllowedOrigin(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== 'production') return true;
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const { hostname } = new URL(origin);
    return (
      hostname === 'lonside.com' ||
      hostname === 'www.lonside.com' ||
      hostname.endsWith('.vercel.app')
    );
  } catch {
    return false;
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  if (rateLimitMap.size >= MAX_RATE_LIMIT_ENTRIES) {
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetAt) rateLimitMap.delete(key);
    }
    if (rateLimitMap.size >= MAX_RATE_LIMIT_ENTRIES) {
      const oldestKey = rateLimitMap.keys().next().value;
      if (oldestKey) rateLimitMap.delete(oldestKey);
    }
  }

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
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Origine non autorisée.' }, { status: 403 });
  }

  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@lonside.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Lonside Studio <onboarding@resend.dev>';

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

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);
  const safeIp = escapeHtml(ip);
  const headerSubject = sanitizeHeaderValue(subject || `Message de ${name}`);

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [contactEmail],
    replyTo: sanitizeHeaderValue(email),
    subject: `[lonside.com] ${headerSubject}`,
    html: `
      <div style="font-family:monospace;background:#0a0a0a;color:#fafafa;padding:32px;max-width:600px;border-radius:12px;border:1px solid #27272a">
        <div style="display:flex;align-items:center;margin-bottom:24px">
          <div style="background:#ffffff;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-right:12px;font-size:16px;font-weight:bold;color:#0a0a0a">L.</div>
          <span style="font-size:18px;font-weight:bold;letter-spacing:0.18em;color:#ffffff">LONSIDE</span>
        </div>
        <h2 style="color:#a1a1aa;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;margin:0 0 20px">Nouveau brief projet</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#a1a1aa;font-size:12px;width:80px">Nom</td><td style="padding:8px 0;color:#fafafa;font-size:12px">${safeName}</td></tr>
          <tr><td style="padding:8px 0;color:#a1a1aa;font-size:12px">Email</td><td style="padding:8px 0;font-size:12px"><a href="mailto:${safeEmail}" style="color:#ffffff">${safeEmail}</a></td></tr>
          ${safeSubject ? `<tr><td style="padding:8px 0;color:#a1a1aa;font-size:12px">Sujet</td><td style="padding:8px 0;color:#fafafa;font-size:12px">${safeSubject}</td></tr>` : ''}
        </table>
        <hr style="border:none;border-top:1px solid #27272a;margin:20px 0"/>
        <p style="color:#e4e4e7;font-size:12px;white-space:pre-wrap;line-height:1.6">${safeMessage}</p>
        <p style="color:#71717a;font-size:10px;margin-top:32px">IP: ${safeIp} · ${new Date().toISOString()}</p>
      </div>
    `,
  });

  if (error) {
    console.error('[contact] Resend error:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'envoi.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, delivered: true });
}

