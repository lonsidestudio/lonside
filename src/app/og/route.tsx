import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import frMessages from '@/lib/i18n/messages/fr.json';
import enMessages from '@/lib/i18n/messages/en.json';

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 220;

function sanitizeOgText(raw: string | null, fallback: string, maxLen: number): string {
  const cleaned = (raw || fallback)
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return fallback.slice(0, maxLen);
  if (cleaned.length <= maxLen) return cleaned;
  return `${cleaned.slice(0, maxLen - 1).trimEnd()}…`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') === 'en' ? 'en' : 'fr';
  const messages = locale === 'en' ? enMessages : frMessages;

  const defaultTitle = messages.metadata.defaultTitle;
  const defaultDescription = messages.metadata.description;

  const title = sanitizeOgText(searchParams.get('title'), defaultTitle, MAX_TITLE_LENGTH);
  const description = sanitizeOgText(
    searchParams.get('description'),
    defaultDescription,
    MAX_DESCRIPTION_LENGTH
  );

  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '64px',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Subtle monochrome ambient light */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            right: '-150px',
            width: '650px',
            height: '650px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '48px' }}>
          <div
            style={{
              background: '#ffffff',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              fontSize: '22px',
              fontWeight: '900',
              color: '#000000',
              fontFamily: 'monospace',
            }}
          >
            L
          </div>
          <span style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
            lonside
            <span style={{ color: '#71717a' }}>.</span>
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            color: '#ffffff',
            fontSize: title.length > 50 ? '42px' : '52px',
            fontWeight: '700',
            lineHeight: '1.1',
            marginBottom: '20px',
            maxWidth: '920px',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            color: '#a1a1aa',
            fontSize: '22px',
            maxWidth: '820px',
            lineHeight: '1.5',
          }}
        >
          {description}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}
