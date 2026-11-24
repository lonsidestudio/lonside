import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSupervisionReport } from '@/lib/supervision';

export const dynamic = 'force-dynamic';

function isAuthorized(request: NextRequest): boolean {
  const configuredToken = process.env.SUPERVISION_TOKEN?.trim();
  if (!configuredToken) return false;
  const authHeader = request.headers.get('authorization') || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!bearer) return false;

  const a = Buffer.from(bearer);
  const b = Buffer.from(configuredToken);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  const isProd = process.env.NODE_ENV === 'production';
  const configuredToken = process.env.SUPERVISION_TOKEN?.trim();
  const authorized = isAuthorized(request);

  if (isProd && configuredToken && !authorized) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      {
        status: 401,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      }
    );
  }

  const report = await getSupervisionReport();

  // En production sans authentification explicite, masquer les détails d'état des clés internes
  const safeReport =
    isProd && !authorized
      ? {
          timestamp: report.timestamp,
          overallStatus: report.overallStatus,
          version: report.version,
          services: report.services.map((service) => ({
            name: service.name,
            category: service.category,
            status: service.status,
          })),
          metrics: report.metrics,
        }
      : report;

  return NextResponse.json(safeReport, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
