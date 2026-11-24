import { NextRequest, NextResponse } from 'next/server';
import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../../keystatic.config';

const handler = makeRouteHandler({ config });

function isKeystaticEnabledInRuntime(): boolean {
  if (process.env.NODE_ENV !== 'production') return true;
  return Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO || process.env.KEYSTATIC_GITHUB_REPO);
}

export async function GET(request: NextRequest) {
  if (!isKeystaticEnabledInRuntime()) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
  return handler.GET(request);
}

export async function POST(request: NextRequest) {
  if (!isKeystaticEnabledInRuntime()) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
  return handler.POST(request);
}
