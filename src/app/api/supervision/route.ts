import { NextResponse } from 'next/server';
import { getSupervisionReport } from '@/lib/supervision';

export const dynamic = 'force-dynamic';

export async function GET() {
  const report = await getSupervisionReport();
  return NextResponse.json(report, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
